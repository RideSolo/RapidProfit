window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("Web3 detected!");
        window.web3 = new Web3(web3.currentProvider);
        // Now you can start your app & access web3 freely:
        var currentNetwork = web3.version.network;
        if (currentNetwork == 3 || currentNetwork == 1) {
            $('#divDappInfo').removeClass("alert-danger");
            $('#divDappInfo').addClass("alert-success");
            $('#dappInfo').html("You are connected to the Blockchain of the Ethereum");
        } else {
            $('#divDappInfo').removeClass("alert-success");
            $('#divDappInfo').addClass("alert-danger");
            $('#dappInfo').html("You are not connected to the network of the Ethereum");
        }
        startApp();
    } else {
        $('#divDappInfo').removeClass("alert-success");
        $('#divDappInfo').addClass("alert-danger");
        $('#dappInfo').html("Please use Chrome or Firefox, install the Metamask extension and retry the request!");
    }
})

function startApp() {
    var contract = initContract();
    var adrressContract = adrressContractBT;

    contract.balanceOf(adrressContract, function (error, data) {
        walletTokens = Number(data) / decimalToken;
	console.log("balance = " + data);
        $('#walletTokens').html(walletTokens.toFixed(4));
    });
//document.getElementById('numberTokens').value = Number(data)/10**18;
}

function checkAddress() {
    var contract = initContract();
    var checkingAddress = $('#testAddress').val();
    console.log("checkingAddress = " + checkingAddress);
    contract.balanceOf(checkingAddress, function (error, data) {
        $('#balanceTokens').html(Number(data) / decimalToken);
    });
    contract.userTransfered(checkingAddress, function (error, data) {
        if(data == true){
            $('#isSent').html("Yes");
        } else $('#isSent').html("No");
    });
}

function checkCostGas() {
    var numberAddress = $('#numberAddress').val();
    var result = 0;
    //console.log("numberAddress = " + numberAddress);
    //console.log("amountGwei = " + amountGwei);
    var chisloRaz = roundLessToPackage(numberAddress) / sizePackage;
    var ostatok = numberAddress - roundLessToPackage(numberAddress);
    if (numberAddress <= sizePackage) {
        result = calcGas(numberAddress);
    } else if (numberAddress > sizePackage && ostatok > 0) {
        result = calcGas(ostatok) + calcGas(sizePackage)*chisloRaz;
    } else if (numberAddress > sizePackage && ostatok == 0) {
        result = calcGas(sizePackage)*chisloRaz;
    }
    console.log("chisloRaz = " + chisloRaz);
    console.log("ostatok = " + ostatok);
    $('#costTransfer').html(result.toFixed(6));

}

function calcGas (numberAddress) {
    var amountGwei = $('#amountGwei').val();
    var unitsArray = [131790,  225087,  318480,  591777,  775074,
           1143220, 1376463, 1437852, 1904241, 2370726,
           2837115, 3303504, 3769893, 4003039 ];
    /*
    2 - 131790 - 0.000131
    4 - 225087 - 0.000225
    6 - 318480
    8 - 591777 - 0.000591
    10 - 775074 - 0.000775
    15 - 1143220 - 0.001143
    20 - 1376463 - 0.001376 (971367) (971463)
    30 - 1437852 - ()
    40 - 1904241
    50 - 2370726
    60 - 2837115
    70 - 3303504
    80 - 3769893
    85 - 4003039
        */
    var result = 0;
    console.log("numberAddress = " + numberAddress);
    if (0 < numberAddress && numberAddress < 3) {
        result = unitsArray[0];
    } else if (3 <= numberAddress && numberAddress < 5) {
        result = unitsArray[1];
    } else if (5 <= numberAddress && numberAddress < 7) {
        result = unitsArray[2];
    } else if (7 <= numberAddress && numberAddress < 9) {
        result = unitsArray[3];
    } else if (9 <= numberAddress && numberAddress < 11) {
        result = unitsArray[4];
    } else if (11 <= numberAddress && numberAddress < 16) {
        result = unitsArray[5];
    } else if (16 <= numberAddress && numberAddress < 21) {
        result = unitsArray[6];
    } else if (21 <= numberAddress && numberAddress < 31) {
        result = unitsArray[7];
    } else if (31 <= numberAddress && numberAddress < 41) {
        result = unitsArray[8];
    } else if (41 <= numberAddress && numberAddress < 51) {
        result = unitsArray[9];
    } else if (51 <= numberAddress && numberAddress < 61) {
        result = unitsArray[10];
    } else if (61 <= numberAddress && numberAddress < 71) {
        result = unitsArray[11];
    } else if (71 <= numberAddress && numberAddress < 81) {
        result = unitsArray[12];
    } else if (81 <= numberAddress && numberAddress < 86) {
        result = unitsArray[13];
    } else if (85 < numberAddress) {
        result = 0;
    }

    result = result*amountGwei*0.000000001;
    console.log("result = " + result);
    return result;
}

$(document).ready(function () {
    var test;
    var data;

    $.ajax({
        url: "abi.json",
        dataType: "text",
        async: true,
        success: function (msg) {
            $("#abiContract").val(JSON.stringify(msg));
            //console.log("abi from file = " + JSON.stringify(msg));
        }
    });

    $.ajax({
        url: "distribution.csv",
        dataType: "text",
        async: true,
        success: function (msg) {
            test = msg;
            dataCsv = $.csv.toObjects(msg);
            //document.getElementById('dataCsv').value = dataCsv;
            fromCsv = dataCsv;
            numberTimes = roundLessToPackage(fromCsv.length) / sizePackage;
            remain = fromCsv.length - roundLessToPackage(fromCsv.length);
            realNumberTimes = 0;
            if (remain > 0) {
                realNumberTimes = numberTimes + 1;
            } else {
                realNumberTimes = numberTimes;
            }

            $('#sendAdresses').html(dataCsv.length);
            $('#sendTokens').html(getAmountTokens() / decimalToken);
            sentTokens = getAmountTokens() / decimalToken;
            $('#numberTimes').html(realNumberTimes);
        }
    });

});

var sizePackage = 40;
var walletTokens = 0;
var fromCsv;
var current_progress = 0;
var numberTimes;
var remain;
var realNumberTimes;
var step = 0;
var sentTokens = 0;
var lastAddress;
var decimalToken = 10**3;
var adrressContractBT = "0x62a03c868c959386b2df7f266e79bc711fb92398";

function batchTransfer() {
    var contract = initContract();

    if (walletTokens == 0 && walletTokens < sentTokens) {
        $('#errorInfo').html("Not enough tokens to perform an operation!");
        $('#divErrorInfo').show();
    } else {
        $('#errorInfo').html("");
        $('#divDappInfo').hide();
        //console.log("numberTimes = " + numberTimes);
        //console.log("remain = " + remain);
        //console.log("realNumberTimes = " + realNumberTimes);

        if (step == numberTimes) {
            step++;
        }
        if (step < numberTimes) {
            console.log("step*sizePackage=" + step * sizePackage + " sizePackage" + sizePackage);
            //convertCsvToAddress(step * sizePackage, sizePackage);
            //convertCsvToValue(step * sizePackage, sizePackage);
             contract.batchTransfer(convertCsvToAddress(step*sizePackage, sizePackage),convertCsvToValue(step*sizePackage, sizePackage), function(error, data) {
                console.log("data = " + data);
             });
            current_progress = ((step + 1) * sizePackage / fromCsv.length) * 100;
            setProgressCount(current_progress);

            step++;
        }

        if (realNumberTimes > numberTimes && step == numberTimes + 1) {
            console.log("numberTimes*sizePackage=" + numberTimes * sizePackage + " remain" + remain);
            //convertCsvToAddress(numberTimes * sizePackage, remain);
            //convertCsvToValue(numberTimes * sizePackage, remain);
             contract.batchTransfer(convertCsvToAddress(numberTimes*sizePackage, remain),convertCsvToValue(numberTimes*sizePackage, remain), function(error, data) {
                console.log("data = " + data);
             });
            current_progress = 100;
            setProgressCount(current_progress);

        }

    }
}

function setProgressCount(countProgress) {
    $("#test").html("<h1> " + countProgress.toFixed(2) + "%</h1>");
    $("#dynamic")
        .css("width", countProgress + "%")
        .attr("aria-valuenow", countProgress)
        .text(countProgress + "% Complete");
    if (countProgress > 99.999) {
        $("#dynamic").removeClass("active");
        $("#dynamic").html("Done");
    }
}

function getAmountTokens() {
    var result = 0;
    for (var i = 0; i < fromCsv.length; i++) {
        result = result + Number(fromCsv[i].value);
    }
    return result;
}

function roundLessToPackage(num) {
    return Math.floor(num / sizePackage) * sizePackage;
}

function convertCsvToAddress(position, numberAdresses) {
    console.log("transfering adresses:");
    var arrayAdresses = [];
    for (var i = position; i < position + numberAdresses; i++) {
        arrayAdresses.push(fromCsv[i].address.toString());
        console.log("i=" + i + " address=" + fromCsv[i].address.toString() + "\n");
    }
    $('#lastAddress').html(fromCsv[i-1].address);
    return arrayAdresses
}

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate - date < millis);
}

function convertCsvToValue(position, numberValues) {
    console.log("transfering values:");
    var arrayValues = [];
    for (var i = position; i < position + numberValues; i++) {
        arrayValues.push(Number(fromCsv[i].value));
        console.log("i=" + i + " value=" + Number(fromCsv[i].value) + "\n");
    }
    return arrayValues;
}

function initContract() {
    var address = {
        "1": adrressContractBT // Ropsten
    }
    var current_network = web3.version.network;
    var myWalletAddress = web3.eth.accounts[0];
    if (myWalletAddress == undefined) {
        $('#errorInfo').html("Your wallet is closed!");
        $('#divErrorInfo').show();
    } else {
        $('#errorInfo').html("");
        $('#divErrorInfo').hide();
    }

    var abiContract = [{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userTransfered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"standardToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipients","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalUserTransfered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_admin","type":"address"},{"name":"_isAdmin","type":"bool"}],"name":"setContractAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contractAdmins","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}];
    //var abiContract = $('#abiContract').val();
    //console.log("abiContract2 = " + abiContract);
    var contract = web3.eth.contract(abiContract).at(address[current_network]);
    console.log("Contract initialized successfully");
    console.log("current_network = " + current_network);
    console.log("myWalletAddress = " + myWalletAddress);

    return contract;
}

function resetting() {
    location.reload();
}

//https://getbootstrap.com/docs/4.0/components/popovers/