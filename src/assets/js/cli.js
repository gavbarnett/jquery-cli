/**
 * Logger function, by Ian Isted
 * @string The string you'd like to output to the log
 * @logID A unique id to be given to your ouput. This allows you to extend the specific output later
 * @status Adds a class name to your output, allowing you style based on status types, etc.
 */

function logger(string,logID,status) {
	var terminal = '#terminal'; // ID of your output container. e.g. #terminal

	if ( typeof status !=='undefined') {
		status = ' class="' + status + '"';
	} else {
		status = '';
	}
	if ( typeof logID !=='undefined' && logID !== false) {
		//logID = ' id="' + logID + '"'
		if ($(terminal + ' ul li#logger-id-' + logID).length !== 0) {
			$(terminal + ' ul li#logger-id-' + logID).append(string);
		} else {
			$(terminal + ' ul').append('<li id="logger-id-' + logID + '"'  + status + '><span class="caller">' + arguments.callee.caller.name + '</span>' + string + '</li>');
		}
		
	} else { 
		$(terminal + ' ul').append('<li' + status + '><span class="caller">' + arguments.callee.caller.name + '</span>' + string + '</li>');
	};
	$(terminal).scrollTop(900000);
}


var connection = false; // Boolean to tell the system if a server connection has been made



var Game = {
	init:function() {
		// Initialise the game, and begin listening for key presses.
	
		logger('Application version: ' + version);
		
		$('.cmd').keydown(function(event) {
				switch(event.which) {
					case 13:
						if ($('.cmd').val() == "") {
							return false;
						}
						Game.Cmd.input($('.cmd').val());
						break;
					case 27:
						$('.cmd').val('');
						break;
					case 38:
						Game.Cmd.History.previous();
						event.preventDefault();
						break;
					case 40:
						Game.Cmd.History.next();
						event.preventDefault();
						break;
					
				}	
		});
	},
	Cmd: {
		input:function(e) {
			
			var input = e;
					
			if (input.toLowerCase().indexOf("<script") >= 0) {
				logger("Not cool dude");
				$('.cmd').val('');
				return false;
			}
					
			Game.Cmd.History.list.push(input);
			
			var cmd = $('.cmd').val().split(' ')[ 0 ].toLowerCase();
			var string = input.substr(input.indexOf(" ") + 1);
			
			
			switch(cmd) {
				case "connect":
					if (string == "true") {
						Game.connect(true);
					} else {
						Game.connect();
					}
					break;
				case "h4x0r": case "hacktheplanet": case "hacker": case "l33t": case "1337":
					$('html').toggleClass('hacker');
					break;
				case "time": case "clock": case "date":
					logger('<span class="error"><strong>' + cmd + '</strong>: ' + $.now() + '</span>');
					break;
				case "print": case "echo":
					logger('<strong class="muted">' + string + '</strong>');
					break;
				case "about":
					logger('<em>CLI version 1.0.<br />Built by <a href="http://twitter.com/ianisted" target="_blank">@ianisted</a>.<br />Released under <a href="https://github.com/ianisted/jquery-cli/blob/master/LICENSE" target="_blank">MIT license</a>. Type <strong>about-license</strong> to see the license.</strong></em>');
					break;
				case "about-license":
					logger('<em>The MIT License (MIT)<br /><br />Copyright (c) 2016 Ian Isted<br />Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</em>');
					break;
				case "clear": case "cls":
					$('#terminal ul').html('');
					break;
				case "history":
					historylog = "";
					$.each(Game.Cmd.History.list, function(i,val) {
						historylog = historylog + i + ': ' + val + "<br />";
					});
					logger(historylog);
					break;
				default:
					Game.Cmd.send(e);
					break;
			}
				
			$('.cmd').val('');
		
		},
		send:function(e) {
			logger('<strong>' + e + '</strong> is not a valid command.');
		},
		History: {
			list: [],
			list_position:0,
			previous:function() {
				var list = Game.Cmd.History.list;
				var pos = Game.Cmd.History.list_position;
				
					if (pos == 0) {
						pos = list.length - 1;
						Game.Cmd.History.list_position = pos;
						$('.cmd').val(Game.Cmd.History.list[pos]);
					} else {
						pos = pos - 1;
						Game.Cmd.History.list_position = pos;
						$('.cmd').val(Game.Cmd.History.list[pos]);
					}
				
			},
			next:function() {
				var list = Game.Cmd.History.list;
				var pos = Game.Cmd.History.list_position;
				
					if (pos == 0) {
						//Game.Cmd.History.list_position = list.length - 1;
						//pos = Game.Cmd.History.list_position;
						$('.cmd').val(Game.Cmd.History.list[pos]);
						pos = pos + 1;
						Game.Cmd.History.list_position = pos;
					} else if (pos < list.length) {
						$('.cmd').val(Game.Cmd.History.list[pos]);
						if (pos != list.length - 1) {
							pos = pos + 1;
							Game.Cmd.History.list_position = pos;
						} else {
							pos = 0;
							Game.Cmd.History.list_position = pos;
						}
					}
				
			}
		}
		
		
	},
	connect:function(params) {
		// Connect to server
			
		logger('Could not connect. Application has not been setup to connect to a server.');
		 
	}
}