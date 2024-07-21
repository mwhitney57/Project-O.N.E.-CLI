//  Terminal Constants
const term = new Terminal();
const fitAddon = new FitAddon.FitAddon();

//  WebSocket Constants
/** The WebSocket client object used for communicating with the WebSocket Server. */
let ws = null;
/**
 * The active timeout interval responsible for keeping the WebSocket connection alive.
 * This variable is set to null when not in use.
 */
var keepAliveInterval = null;

//  String Escape Codes
/** Escape String to be used before additional strings to make Terminal adjustments. */
const ESC = '\x1b[';
/** Reset text escape code. */
const RESET = ESC + "0m";
/** Bold text escape code. */
const BOLD = ESC + "1m";
/** Cyan text color escape code. */
const CYAN = ESC + "38;5;14m";
/** Green text color escape code. */
const GREEN = ESC + "38;5;10m";
/** Purple text color escape code. */
const PURPLE = ESC + "38;5;105m";
/** Red text color escape code. */
const RED = ESC + "38;5;9m";
/** Red error text color in bold escape code. */
const RED_ERROR = BOLD + ESC + "38;5;1m";
/** Yellow text color escape code. */
const YELLOW = ESC + "38;5;11m";

//  Convenience and Readability Strings
/** Convenience String for inserting a new line while writing to the Terminal. */
const LINE_CODE = "\r\n";
/** The prompt text inserted right before the user's typing area on a new line. */
const PROMPT = "[#]";

//  Input/Command Variables
/** A String containing all of the current user input before being entered and parsed upon a carriage return. */
var inputCommand = '';
/** Boolean for whether or not the Terminal is accepting any form of input. */
var acceptingInput = false;
/** String containing a sent command that has yet to receive a response. */
var activeCommand = "";
/**
 * The number of milliseconds that the command was active for without receiving a response.
 * Before receiving a response, this variable's value will be representative of the time the request was sent.
 * Therefore, it will only contain a proper value after a response is received and before it is reset.
 */
var activeCommandTime = 0;
/** Boolean for whether or not a response has been received after sending a command. */
var commandResponseReceived = false;


//  Startup
$(document).ready(function () {
    //  Setup Terminal
    console.log("Terminal Starting...");
    term.loadAddon(fitAddon);
    term.open(document.getElementById("terminal"));
    term.prompt = () => {
        printPrompt();
    };
    term.setOption('theme', { background: '#1E1E1E' });
    fitAddon.fit();

    //  Connect to WebSocket Server and Finalize Startup
    finalizeStartup();
});

/** Asynchronously connects to the WebSocket server then finishes startup. */
async function connectToServer() {
    // Get Token
    const TOKEN = document.getElementById("PROJECT_ONE_ENV").getAttribute("token");

    //  Create WebSocket Client & Start Connection
    ws = new WebSocket("wss://one-server.mwhitney.dev", TOKEN);

    //  Add Event Listeners
    ws.addEventListener("open", () => {
        //  Keep-Alive
        ws.send("#connection=keep-alive");
        startKeepAlive();

        if(activeCommand == "connect") {
            commandResponseReceived = true;
        }
    });
    ws.addEventListener("message", ({ data }) => {
        parseMessage(data);
    });
    ws.addEventListener("close", () => {
        //  Don't Keep-Alive
        stopKeepAlive();

        term.writeln(LINE_CODE + BOLD + YELLOW + "# Disconnected from the server.");
        if(activeCommand == "disconnect") {
            commandResponseReceived = true;
        }
        else {
            printPrompt();
        }
    });

    //  Print/Show Connection Process
    term.writeln(BOLD + YELLOW + "# Contacting server...");
    while (ws.readyState === ws.CLOSED) {
        await new Promise(r => setTimeout(r, 20));
    }
    term.writeln("## Connecting to server...");
    while (ws.readyState === ws.CONNECTING) {
        await new Promise(r => setTimeout(r, 10));
    }
    if (ws.readyState === ws.OPEN) {
        term.writeln("### Connected!");
    }
    else {
        term.writeln(LINE_CODE + RED_ERROR + "<!> Failed to connect to server.");
    }
    await new Promise(r => setTimeout(r, 500));
}

/** Asynchronously completes the final steps required for startup including establishing the connection to the server and printing the startup text. */
async function finalizeStartup() {
    //  Connect to Server
    await connectToServer();

    //  Clear Connection Text
    clearText();

    //  Startup Prints
    printWelcome();
    printPrompt();

    //  Setup Event Listener for Terminal
    term.onData(e => {
        //  Parse Data if Accepting Input
        if(acceptingInput) {
            parseData(e);
        }
    });

    //  Start Accepting Input
    acceptingInput = true;
}

/** Prints the welcome message to the Terminal. */
function printWelcome() {
    term.writeln(BOLD + CYAN + "## Welcome to the Project O.N.E. CLI");
    term.writeln("|  # Type " + PURPLE + "'help'" + CYAN +" for help.")
    term.writeln("|  # Enter commands below.");
    term.writeln("-");
}

/** Prints the prompt text to the Terminal. */
function printPrompt() {
    if (inputCommand.length != 0) {
        term.write(LINE_CODE + BOLD + CYAN + PROMPT + RESET + " " + inputCommand);
    }
    else {
        term.write(LINE_CODE + BOLD + CYAN + PROMPT + RESET + " ");
    }
}

/** Clears all of the text currently displayed on the Terminal. */
function clearText() {
    term.write('\x1bc');
}

/** Clears all of the text currently displayed on the Terminal, then prints a new prompt afterwards. */
function clearTextWithPrompt() {
    term.clear();
}

/** Parses the passed data and acts based upon the value. */
async function parseData(data) {
    //  Read Data (Input)
    switch (data) {
        //  Enter Key Pressed
        case '\r':
            // Do Not Accept Input While Handling Command
            acceptingInput = false;
            
            inputCommand = inputCommand.trim();
            if (inputCommand == "help") {
                term.writeln(LINE_CODE + BOLD + CYAN + "# Help:");
                term.writeln(" > " + GREEN + "open|unlock [seconds]" + CYAN + " - Sends the signal to start an open door cycle lasting a certain amount of seconds.");
                term.writeln(" > " + RED + "lock" + CYAN + " - Requests for the door to be locked immediately.");
                term.writeln(" > " + PURPLE + "system <lock|unlock>" + CYAN + " - Commands for interfacing with the local system.");
                term.writeln(" > " + GREEN + "connect" + CYAN + " - Attempts to open a connection to the server.");
                term.writeln(" > " + RED + "disconnect" + CYAN + " - Closes the connection to the server.");
                term.writeln(" > " + PURPLE + "broadcast <message>" + CYAN + " - Broadcasts a message to the server and all of the other clients.");
                term.writeln(" > " + PURPLE + "msg|message <message>" + CYAN + " - Sends a custom message to the server.");
                term.writeln(" > " + YELLOW + "ping" + CYAN + " - Pings the server.");
                term.writeln(" > " + PURPLE + "cls|clear" + CYAN + " - Clears all of the current text, showing only a new prompt line afterwards.");
                term.writeln("More functionality may be implemented soon...");
            }
            else if (inputCommand.startsWith("open") || inputCommand.startsWith("unlock") || inputCommand == "lock"
                    || inputCommand.startsWith("system") 
                    || inputCommand == "connect" || inputCommand == "disconnect" || inputCommand == "ping"
                    || inputCommand.startsWith("broadcast") || inputCommand.startsWith("msg") || inputCommand.startsWith("message")) {
                await parseServerCommand(inputCommand);
            }
            else if (inputCommand == "cls" || inputCommand == "clear") {
                clearText();
            }
            else {
                term.writeln(LINE_CODE + BOLD + CYAN + "The specified command was not recognized or contains invalid syntax.")
            }

            //  Prepare for More Input
            inputCommand = '';
            acceptingInput = true;
        //  Ctrl + C Key Combination Used
        case '\u0003':
            printPrompt();

            break;
        //  Backspace Key Pressed
        case '\u007F':
            //  Delete last character but do not delete the prompt.
            if (term._core.buffer.x > PROMPT.length + 1) {
                term.write("\b \b");
            }
            inputCommand = inputCommand.slice(0, -1);

            break;
        //  Any Other Data Input
        default:
            //  Add input to current command string and write it to the terminal.
            inputCommand = inputCommand + data;
            term.write(data);
    }
}

/** Parses the passed command intended to be sent to the server. */
async function parseServerCommand(commandInput) {
    activeCommand = "";

    //  Only send commands if connected to the server.
    if (ws.readyState === ws.OPEN) {
        if (commandInput.startsWith("open") || commandInput.startsWith("unlock")) {
            //  Unlock the Door
            //  Determine number of seconds.
            let secondsSpecified = commandInput.indexOf(" ") != -1;
            let seconds = 3;
            if (secondsSpecified) {
                try {
                    seconds = parseInt(commandInput.substring(commandInput.indexOf(" ") + 1));
                    if (seconds <= 0 || seconds > 9 || isNaN(seconds)) {
                        seconds = -1;
                    }
                } catch (error) {
                    seconds = -1;
                }
            }
            else {
                seconds = 3;
            }

            //  Send request if the request was valid.
            if (seconds == -1) {
                term.writeln(LINE_CODE + RED_ERROR + "The number of seconds must be a positive, whole integer below 10.");
            }
            else {
                term.writeln(LINE_CODE + BOLD + CYAN + "# " + GREEN + "Open" + CYAN + " Request Sent.");
                sendCommand("#command=!security:unlock " + seconds);
            }
        }
        else if (commandInput == "lock") {
            //  Lock the System
            term.writeln(LINE_CODE + BOLD + CYAN + "# " + RED + "Lock" + CYAN + " Request Sent.");
            sendCommand("#command=!security:lock");
        }
        else if (commandInput.startsWith("system")) {
            //  System Command
            let argumentOne = commandInput.substring(commandInput.indexOf(" ") + 1);
            if (argumentOne == "unlock") {
                //  Unlock the System
                term.writeln(LINE_CODE + BOLD + CYAN + "# System " + GREEN + "Open" + CYAN + " Request Sent.");
                sendCommand("#command=!security:system:unlock");
            }
            else if (argumentOne == "lock") {
                //  Lock the System
                term.writeln(LINE_CODE + BOLD + CYAN + "# System " + RED + "Lock" + CYAN + " Request Sent.");
                sendCommand("#command=!security:system:lock")
            }
            else {
                term.writeln(LINE_CODE + RED_ERROR + "Invalid or missing command argument(s).");
            }
        }
        else if (commandInput == "connect") {
            //  Already Connected
            term.writeln(LINE_CODE + RED_ERROR + "Already connected to the server.");
        }
        else if (commandInput == "disconnect") {
            //  Disconnect from Server
            activeCommand = "disconnect";
            term.writeln(LINE_CODE + BOLD + CYAN + "Disconnecting...");
            await ws.close();
        }
        else if (commandInput == "ping") {
            //  Ping the Server
            term.writeln(LINE_CODE + BOLD + CYAN + "Ping!");
            sendCommand("#ping");
            activeCommandTime = performance.now();
        }
        else if (commandInput.startsWith("broadcast")) {
            //  Broadcast a Message
            if (commandInput == "broadcast") {
                term.writeln(LINE_CODE + RED_ERROR + "Invalid syntax. You must include a message!");
            }
            else {
                term.writeln(LINE_CODE + BOLD + CYAN + "Sending broadcast...");
                sendCommand("#broadcast=" + commandInput.substring(commandInput.indexOf(" ") + 1));
            }
        }
        else if (commandInput.startsWith("msg") || commandInput.startsWith("message")) {
            //  Send a Raw Message
            if (commandInput == "msg" || commandInput == "message") {
                term.writeln(LINE_CODE + RED_ERROR + "Invalid syntax. You must include a message!");
            }
            else {
                term.writeln(LINE_CODE + BOLD + CYAN + "Sending message...");
                sendCommand(commandInput.substring(commandInput.indexOf(" ") + 1));
            }
        }
    }
    else if (ws.readyState === ws.CONNECTING) {
        //  Allow certain commands to still execute.
        if(commandInput == "disconnect") {
            //  Disconnect from Server
            activeCommand = "disconnect";
            term.writeln(LINE_CODE + BOLD + CYAN + "Disconnecting...");
            await ws.close();
        }
        else {
            term.writeln(LINE_CODE + RED_ERROR + "Still connecting to the server.");
        }
    }
    else if (ws.readyState === ws.CLOSED) {
        if (commandInput == "connect") {
            //  Connect to Server
            activeCommand = "connect";
            term.writeln("");
            await connectToServer();
        }
        else {
            term.writeln(LINE_CODE + RED_ERROR + "Not connected to the server.");
        }
    }

    //  Await Potential Server Response
    let waitCycles = 0;
    while(waitCycles<100 && activeCommand.length>0 && !commandResponseReceived) {
        await new Promise(r => setTimeout(r, 50));
        waitCycles++;
    }

    //  Prepare Variables for Next Usage.
    activeCommand = "";
    commandResponseReceived = false;
}

/** Parses the passed message received from the connected WebSocket server. */
function parseMessage(message) {
    let shouldPrintPrompt = activeCommand.length === 0;
    
    message = message.trim();
    if (message.startsWith("#broadcast")) {
        //  Incoming Message was a Broadcast
        term.writeln(LINE_CODE + YELLOW + "Broadcast from Server: " + message.substring(message.indexOf("=") + 1));
    }
    else if (message.startsWith("#response")) {
        //  Incoming Message was a Response
        if(activeCommand.length>0) {
            commandResponseReceived = true;

            //  If time is being kept, append it to the response message.
            if(activeCommandTime>0) {
                activeCommandTime = performance.now() - activeCommandTime;
                message = message + " (" + Math.round(activeCommandTime) + "ms)";
                activeCommandTime = 0;
            }
        }
        term.writeln(LINE_CODE + YELLOW + "Response from Server: " + message.substring(message.indexOf("=") + 1));
    }
    else if (message.startsWith("#connection")) {
        //  Incoming Message was Relating to Connection
        //  Do Nothing for Now
        shouldPrintPrompt = false;
    }
    else {
        //  Incoming Message was a Raw Message
        term.writeln(LINE_CODE + YELLOW + "Message from Server: " + message);
    }

    //  Print prompt if the message was unanticipated and only if necessary.
    if (shouldPrintPrompt) {
        printPrompt();
    }
}

/** A helper method for sending commands and consistently making it known to the rest of the application when one is sent. */
function sendCommand(command) {
    activeCommand = "standard";
    ws.send(command);
}

/** Starts the keep-alive interval to send messages every 30 seconds and keep the connection to the server alive. */
async function startKeepAlive() {
    if(ws.readyState === ws.OPEN) {
        keepAliveInterval = setInterval(() => {
            ws.send("#connection=keep-alive");
        }, 30000);
    }
}

/** Stops the keep-alive interval that keeps the connection to the server alive while active. */
async function stopKeepAlive() {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
}