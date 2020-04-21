/*
Copyright (c) 2020, pedro-arruda-moreira
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// START: ===================== Constants =====================

// Runtime
var HAS_WSCRIPT = typeof(WScript) != 'undefined';

// Messages
var WRONG_ENV_MSG = "Sorry, this JS file will only work on WScript (MS Windows) =(";

// 'Dynamic' Constants
var INSTALL_PATH = (function() {
	if(!HAS_WSCRIPT) return null;
	var sfn = WScript.ScriptFullName;
	return sfn.substring(0, sfn.lastIndexOf(WScript.ScriptName));
}());

var ARGUMENTS = (function() {
	if(!HAS_WSCRIPT) return null;
	var i;
	var args = [];
	for(i = 0; i < WScript.Arguments.length; i++) {
		var arg = WScript.Arguments(i);
		if(arg.indexOf(':') > -1) {
			var spl = arg.split(':');
			args[spl[0].replace('--', '')] = spl[1];
		}
		args.push(arg);
	}
	return args;
}());

var FSO = (function() {
	if(!HAS_WSCRIPT) return null;
	return new ActiveXObject("Scripting.FileSystemObject"); 
}());

// END:   ===================== Constants =====================

/**
 * Checks if an argument was passed.
 */
function hasArgument(arg) {
	var i;
	for(i = 0; i < ARGUMENTS.length; i++) {
		if(ARGUMENTS[i] == '--' + arg) {
			return true;
		}
	}
	return false;
}

/**
 * Loads a file and returns its content as a string
 */
function include(jsFile) {
	var f, s;
	f = FSO.OpenTextFile(jsFile);
	s = f.ReadAll();
	f.Close();
	return s; 
}

/**
 * script entry point
 */
(function() {	
	if(HAS_WSCRIPT) {
		eval('(function(){' + include(INSTALL_PATH + 'app.js') + '}());');
	} else if(alert) {
		alert(WRONG_ENV_MSG);
	} else if(console && console.log) {
		console.log(WRONG_ENV_MSG);
	}
}());