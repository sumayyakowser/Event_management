/**
 * @aiq.servicesworkbench
 * This script requires Services Workbench
*/
function getFirstFolderWindows(dirOutput) {
    return dirOutput.split('\n')
        .filter(line => line.includes('<DIR>'))
        .map(line => line.split('<DIR>')[1]?.trim())
        .filter(name => name && name !== '.' && name !== '..')[0] || null;
}
 
function getFirstFolderLinux(lsOutput) {
    return lsOutput.split('\n')
        .filter(line => line.startsWith('d') && !line.includes(' . ') && !line.includes(' .. '))
        .map(line => {
            const parts = line.trim().split(/\s+/);
            return parts[parts.length - 1];
        })
        .filter(name => name && name !== '.' && name !== '..')[0] || null;
}
 
function detectServerOS() {
    // Run pwd command to detect Linux
    var pwdResult = exec(".", "pwd");
    if (pwdResult.output && pwdResult.output.indexOf("/") === 0) {
        log("Server OS detected: Linux (pwd output: " + pwdResult.output.substring(0, 100) + ")");
        return "linux";
    }
    // Try uname for additional confirmation
    var unameResult = exec(".", "uname");
    if (unameResult.output && !unameResult.error) {
        log("Server OS detected: Linux (uname output: " + unameResult.output + ")");
        return "linux";
    }
    // Try Windows detection
    var verResult = exec(".", "cmd", "/c", "ver");
    if (verResult.output && verResult.output.toLowerCase().indexOf("windows") !== -1) {
        log("Server OS detected: Windows (ver output: " + verResult.output + ")");
        return "windows";
    }
    log("Server OS detection inconclusive, defaulting to Linux");
    return "linux";
}
 
function get_OTP() {
    const NUMBER_OF_DIGITS = 6;
    // Client-side OS detection (for informational purposes only)
    const System = Java.type('java.lang.System');
    const clientOS = System.getProperty('os.name').toLowerCase();
    log("Client OS: " + clientOS);
    // SERVER-side OS detection (this is what matters!)
    const serverOS = detectServerOS();
    const isWindows = (serverOS === "windows");
    log("Server OS: " + serverOS);
    log("Will use executable for: " + (isWindows ? "Windows" : "Linux"));
    // Load the secret from HashDPL
    setVariablesIfNeeded('{ds}/secret.csv','HashDPL',0);
    // Detect the correct folder path
    var exeFolder = ".";
    var executableName = isWindows ? "totp_generator.exe" : "totp_generator_linux";
    log("Looking for executable: " + executableName);
    // Get directory listing based on SERVER OS
    var filelist;
    if (isWindows) {
        filelist = exec(".", "dir");
    } else {
        filelist = exec(".", "ls", "-la");
    }
    log("Directory listing output (first 500 chars): " + filelist.output.substring(0, 500));
    if (filelist.output.indexOf(executableName) == -1) {
        // Script is running from a BULK SCENARIO so need to retrieve root folder
        log("Executable not found in current directory. Checking parent directory...");
        exeFolder = isWindows 
            ? getFirstFolderWindows(filelist.output)
            : getFirstFolderLinux(filelist.output);
        log("Running from BULK SCENARIO. Using folder: " + exeFolder);
        // Verify the executable exists in the detected folder
        if (!exeFolder) {
            log("ERROR: Could not detect folder containing executable");
            return "ERROR: Folder detection failed";
        }
        // List contents of detected folder to verify
        var checkFolder;
        if (isWindows) {
            checkFolder = exec(exeFolder, "dir");
        } else {
            checkFolder = exec(exeFolder, "ls", "-la");
        }
        log("Contents of folder '" + exeFolder + "': " + checkFolder.output.substring(0, 500));
    }
    // Execute the TOTP generator based on SERVER OS
    var result;
    try {
        if (isWindows) {
            log('Executing Windows: ' + exeFolder + '/totp_generator.exe');
            result = exec(exeFolder, "totp_generator.exe", $SECRET);
        } else {
            log('Executing Linux: ' + exeFolder + '/totp_generator_linux');
            // Make sure the Linux executable has execute permissions
            var chmodResult = exec(exeFolder, "chmod", "+x", "totp_generator_linux");
            log("chmod result: " + chmodResult.output);
            result = exec(exeFolder, "/opt/aiq/totp_generator_linux", $SECRET);
        }
    } catch (e) {
        log("ERROR executing TOTP generator: " + e);
        return "ERROR: " + e;
    }
    // Log the full result for debugging
    log("Execution result output: " + result.output);
    if (result.error) {
        log("Execution result error: " + result.error);
    }
    // Check for errors
    if (result.error && result.error.length > 0) {
        log("Error: " + result.error);
        return "ERROR: " + result.error;
    }
    // Validate output format
    if (!result.output || result.output.indexOf("code:") == -1) {
        log("ERROR: Output does not contain 'code:'. Full output: " + result.output);
        return "ERROR: Invalid output format";
    }
    log("Code retrieved successfully");
    // Extract the 6-digit code from output
    var codeStartIndex = result.output.indexOf("code:") + 6;
    var code = result.output.substring(codeStartIndex, codeStartIndex + NUMBER_OF_DIGITS).trim();
    return code;
}
 
// Usage
var otpCode = get_OTP();
log("The code is: " + otpCode);
locker.put("OTPVAL",otpCode);