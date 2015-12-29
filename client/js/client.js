'use strict';


var taka = taka || function(settings) {
    /**
     * A cross-browser shim for window.requestAnimationFrame.
     * @readonly
     */
    var requestAnimationFrame = (function(){
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    /**
     * Obtains a reference to the currently executing script instance.
     * @returns {Object} - An HTMLElement object.
     * @readonly
     */
    var getCurrentScript = function() {
        if (typeof document.currentScript === 'object') {
            return document.currentScript;
        }
        else {
            var scripts = document.getElementById('script');
            return scripts[scripts.length - 1];
        }
    };


    /**
     * Replaces the current script instance with a specified Element or HTMLElement object.
     * @param {Object} newChild - An Element or HTMLElement object.
     * @readonly
     */
    var replaceScript = function(scriptElement, childToReplace) {
        var parentElement = scriptElement.parentElement;
        if (childToReplace instanceof Element) {
            parentElement.replaceChild(childToReplace.HTMLElement, scriptElement);
        }
        else {
            parentElement.replaceChild(childToReplace, scriptElement);
        }
    };


    /**
     * Gets a cookie with the given key name.
     * @param   {string} key  - The key to search for.
     * @returns {string|null} - The value of the cookie or null if not found.
     * @readonly
     */
    var getCookie = function(key) {
        if (document.cookie !== '') {
            var value = '; ' + document.cookie,
                parts = value.split('; ' + key + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }
        return null;
    };


    /**
     * Sets a cookie with the given parameters.
     * @param {string} key       - The key to set.
     * @param {string} value     - The value to assign.
     * @param {string} [expires] - The expiration date.
     * @param {string} [path]    - The cookie path.
     * @readonly
     */
    var setCookie = function(key, value, expires, path) {
        if (typeof expires === 'undefined' || expires === null) {
            var expires = new Date();
            expires.setTime(expires.getTime() + 31536000000);
            expires = expires.toGMTString();
        }
        if (typeof path === 'undefined' || path === null) {
            var path = '/';
        }
        document.cookie = encodeURI(key) + '=' + encodeURI(value) + '; expires=' + expires + '; path=' + path;
    };


    /**
     * Formats a date in a user-readable format.
     * @param {Object} date - A date object to format.
     * @readonly
     */
    var formatDate = function(date) {
        var newDate = new Date(date),
            newDateString = '';

        var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

        var day = newDate.getDate();
        var monthIndex = newDate.getMonth();
        var hours = newDate.getHours();
        var minutes = newDate.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var ampm = hours >= 12 ? ' PM' : ' AM';
        
        newDateString = monthNames[monthIndex] + ' ' + day + ', ' +  hours + ':' + minutes + ampm;

        return newDateString;
    };


    /**
     * Converts an integer to an IPv4 address string.
     * @param {number} number - An IPv4 address in numeric form.
     * @returns {string} - An IPv4 address in string form.
     * @readonly
     */
    var addressFromInt = function(number) {
        var octet1 = ((number >> 24) & 255),
            octet2 = ((number >> 16) & 255),
            octet3 = ((number >> 8) & 255),
            octet4 = (number & 255);

        return (octet1 + '.' + octet2 + '.' + octet3 + '.' + octet4);
    };


    /**
     * A callback without arguments.
     * @callback argumentlessCallback
     */


    /**
     * Injects the Socket.IO client library into the page.
     * @param {argumentlessCallback} callback - A callback to execute.
     * @readonly
     */
    var injectSocketIO = function(callback) {
        if (typeof window.io === 'undefined' || window.io === null) {
            var script = document.createElement('script');
            script.addEventListener('load', function() {
                return callback();
            });
            script.setAttribute('async', true);
            script.setAttribute('src', 'https://cdn.socket.io/socket.io-1.3.7.js');
            document.head.appendChild(script);
        }
        else {
            return callback();
        }
    };


    /**
     * Injects FontAwesome's CSS style sheet into the page.
     * @param {argumentlessCallback} callback - A callback to execute.
     * @readonly
     */
    var injectFontAwesome = function(callback) {
        var test = document.createElement('span');
        test.classList.add('fa');
        if (window.getComputedStyle(test).fontFamily !== 'FontAwesome') {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
            document.head.appendChild(link);
            link.addEventListener('load', function(event) {
                return callback();
            });
        }
        else {
            return callback();
        }
    };


    /**
     * Sets a cookie with the given parameters.
     * @param {argumentlessCallback} callback - A callback to execute.
     * @readonly
     */
    var injectDependencies = function(callback) {
        injectSocketIO(function() {
            injectFontAwesome(function() {
                return callback();
            });
        });
    };


    /**
     * Determines whether or not the current user has staff privileges.
     * @returns {boolean}
     * @readonly
     */
    var isStaff = function() {
        return (settings.role === 'admin' || settings.role === 'mod');
    };


    /**
     * Constructs a wrapper around a newly created HTMLElement object.
     * @class
     * @classdesc A wrapper for managing HTMLElement objects.
     * @param {Object} elementName  - The name of an element to create.
     * @returns {Object} - Element.<HTMLElement>
     * @readonly
     */
    var Element = function(elementName) {
        this.HTMLElement = document.createElement(elementName);


        /**
         * Appends a specified object to an existing object, making it the last child in the node tree.
         * @param {Object} child - A child object to append; either HTMLElement or Element
         * @returns {this}
         * @readonly
         */
        this.append = function(child) {
            if (child instanceof Element) {
                this.HTMLElement.appendChild(child.HTMLElement);
            }
            else {
                this.HTMLElement.appendChild(child);
            }
            return this;
        };


        /**
         * Prepends a specified object to an existing object, making it the first child in the node tree.
         * @param {Object} child - A child object to append; either HTMLElement or Element
         * @returns {this}
         * @readonly
         */
        this.prepend = function(child) {
            if (child instanceof Element) {
                this.HTMLElement.insertBefore(child.HTMLElement, this.HTMLElement.firstChild);
            }
            else {
                this.HTMLElement.insertBefore(child, this.HTMLElement.firstChild)
            }
            return this;
        };


        /**
         * Removes all children from an existing object.
         * @returns {this}
         * @readonly
         */
        this.removeChildren = function() {
            while (this.HTMLElement.firstChild) {
                this.HTMLElement.removeChild(this.HTMLElement.firstChild);
            }
            return this;
        };


        /**
         * Appends a specified string of text to an existing object.
         * @param {string} string - Some text to append.
         * @returns {this}
         * @readonly
         */
        this.appendText = function(string) {
            var textNode = document.createTextNode(String(string));
            this.HTMLElement.appendChild(textNode);
            return this;
        };


        /**
         * Sets the contents of the Element to a specified string of text.
         * @param {string} string - Some text to use for replacement.
         * @returns {this}
         * @readonly
         */
        this.setText = function(string) {
            this.removeChildren();
            this.appendText(String(string));
            return this;
        };


        /**
         * Adds the specified attribute to the element.
         * @param {string} attribute - An attribute to set.
         * @param {string} value     - The value to set.
         * @returns {this}
         * @readonly
         */
        this.setAttribute = function(attribute, value) {
            this.HTMLElement[String(attribute)] = String(value);
            return this;
        };


        /**
         * Adds all the specified attributes to the element.
         * @param {Object} attributes - An object of attributes in key-value pairs.
         * @returns {this}
         * @readonly
         */
        this.setAttributes = function(attributes) {
            for (var attribute in attributes) {
                this.HTMLElement[String(attribute)] = String(attributes[attribute]);
            }
            return this;
        };


        /**
         * Removes the specified attribute from the element.
         * @param {string} attribute - An attribute to remove.
         * @returns {this}
         * @readonly
         */
        this.removeAttribute = function(attribute) {
            this.HTMLElement.removeAttribute(attribute);
            return this;
        };


        /**
         * Adds the specified data value to the element.
         * @param {string} key   - A data attribute to set.
         * @param {string} value - The value to set.
         * @returns {Object} - Chatbox.prototype.Element
         */
        this.data = function(key, value) {
            this.HTMLElement.dataset[String(key)] = String(value);
            return this;
        };


        /**
         * Adds all the specified styles to the element.
         * @param {Object} styles - An object of styles in key-value pairs.
         * @returns {this}
         * @readonly
         */
        this.css = function(styles) {
            for (var rule in styles) {
                this.HTMLElement.style[String(rule)] = String(styles[rule]);
            }
            return this;
        };


        /**
         * Adds a class name to an existing object.
         * @param {string} className - The name of the class to add.
         * @returns {this}
         * @readonly
         */
        this.addClass = function(className) {
            this.HTMLElement.classList.add(String(className));
            return this;
        };


        /**
         * Toggles a specified class name on an existing object.
         * @param {string} className - The name of the class to toggle.
         * @returns {this}
         * @readonly
         */
        this.toggleClass = function(className) {
            this.HTMLElement.classList.toggle(String(className));
            return this;
        };


        /**
         * Attaches a specified event listener to the element.
         * @param {string} type - The type of event to listen for.
         * @param {argumentlessCallback} callback - A callback function to execute when the event fires.
         * @returns {this}
         * @readonly
         */
        this.on = function(type, callback) {
            this.HTMLElement.addEventListener(String(type), callback);
            return this;
        };


        /**
         * Animates scrolling on an element to a specified position.
         * Uses this beautiful code snippet: http://stackoverflow.com/a/26808520/2301088
         * @param {number} targetPosition - The position to scroll to.
         * @param {number} speed          - The speed to animate the scrolling.
         * @returns {this}
         * @readonly
         */
        this.animateScrollTo = function(targetPosition, speed) {
            var currentPosition = this.HTMLElement.scrollTop,
                currentTime = 0;

            var time = Math.max(0.5, Math.min(Math.abs(currentPosition - targetPosition) / speed, 1));


            var easeOut = function(position) {
                return Math.sin(position * (Math.PI / 2));
            };


            var animateScroll = function() {
                currentTime += 1 / 60;

                var p = currentTime / time;
                var t = easeOut(p);

                if (p < 1) {
                    this.HTMLElement.scrollTop = currentPosition + ((targetPosition - currentPosition) * t);
                    requestAnimationFrame(animateScroll);
                }
                else {
                    console.log('done', Math.random());
                    this.HTMLElement.scrollTop = targetPosition;
                    return this;
                }
            }.bind(this);


            animateScroll();
        };
    };


    /**
     * Creates an embeddable chat object.
     * @class
     * @classdesc An embeddable chat object.
     * @readonly
     */
    var Chat = function() {
        settings.protocol = 'http://';
        settings.host = '127.0.0.1';
        settings.path = '/chat';
        settings.query = 'session_id=' + getCookie('taka-session_id');


        settings.currentScript = getCurrentScript();


        settings.activeTab = false;


        /**
         * Toggles the value of settings.activeTab.
         * @readonly
         */
        var toggleActiveTab = function() {
            settings.activeTab = !settings.activeTab;
        };


        document.addEventListener('focus', function(event) {
            toggleActiveTab();
        });
        document.addEventListener('blur', function(event) {
            toggleActiveTab();
        });


        if (typeof settings.defaultAvatar === 'undefined') {
            settings.defaultAvatar = 'http://placehold.it/35x35.png';
        }
        if (typeof settings.audio === 'undefined') {
            settings.audio = {
                mp3: './audio/click.mp3',
                ogg: './audio.click.ogg'
            };
        }
        if (typeof settings.spacing === 'undefined') {
            settings.spacing = 4;
        }
        if (typeof settings.animateMessages === 'undefined') {
            settings.animateMessages = true;
        }


        injectDependencies(function() {
            var socket = io(settings.protocol + settings.host, {
                path: settings.path,
                query: settings.query
            });


            var container = new Element('div');
            container.setAttribute('id', 'taka');
            container.css({
                'height': settings.height + 'px',
                //'overflow': 'hidden',
                'width': settings.width + 'px'
            });


            var notificationHandler = new Element('audio');
            notificationHandler.setAttributes({
                preload: 'auto',
                volume: '1'
            });
            var mp3 = new Element('source');
            mp3.setAttributes({
                src: settings.audio.mp3,
                type: 'audio/mpeg'
            });
            notificationHandler.append(mp3);
            var ogg = new Element('source');
            ogg.setAttributes({
                src: settings.audio.ogg,
                type: 'audio/ogg'
            });
            notificationHandler.append(ogg);
            container.append(notificationHandler);


            /**
             * Plays an audio notification.
             * @readonly
             */
            var notify = function() {
                notificationHandler.HTMLElement.play();
            };


            var messageWrapper = new Element('div');
            messageWrapper.addClass('message-list-wrapper');
            messageWrapper.css({
                'display': 'inline-block',
                'float': 'left',
                'height': (settings.height - 96) + 'px',
                'margin': (settings.spacing * 2) + 'px',
                'overflow': 'auto',
                'position': 'relative',
                'width': (settings.width - (settings.spacing * 4)) + 'px'
            });
            messageWrapper.on('scroll', function(event) {
                if (messageWrapper.HTMLElement.scrollTop === 0) {
                    socket.emit('loadMessages', messageList.HTMLElement.firstElementChild.id);
                }
            });
            var messageList = new Element('div');
            messageList.addClass('message-list');
            messageList.css({
                width: '100%'
            });
            messageWrapper.append(messageList);
            container.append(messageWrapper);


            /**
             * Scrolls the message wrapper to the bottom.
             * @param {boolean} atBottom      - Whether or not the message wrapper is scrolled to the bottom.
             * @param {boolean} [forceScroll] - Whether or not to scroll to the bottom anyway. Optional.
             * @param {boolean} [animate]     - Whether or not to animate the scrolling. Optional.
             */
            var scrollMessages = function(atBottom, forceScroll, animate) {
                if (typeof forceScroll === 'undefined') {
                    forceScroll = false;
                }


                if (typeof animate === 'undefined') {
                    animate = false;
                }


                if (atBottom || forceScroll) {
                    if (animate && settings.activeTab) {
                        var targetPosition = messageWrapper.HTMLElement.scrollHeight;
                        console.log(targetPosition);
                        messageWrapper.animateScrollTo(targetPosition, 2);
                    }
                    else {
                        messageWrapper.HTMLElement.scrollTop = messageWrapper.HTMLElement.scrollHeight;
                    }
                }
            };


            /**
             * Creates a message for insertion into the message list.
             * @param {Object} data - A message JSON object.
             * @returns {Object} - An HTMLObject with necessary attributes and content.
             * @readonly
             */
            var createMessage = function(data) {
                var message = new Element('div');
                message.addClass('message');
                message.setAttribute('id', data._id);
                message.css({
                    'clear': 'both',
                    'minHeight': (settings.spacing + 35) + 'px',
                    'padding': settings.spacing + 'px ' + settings.spacing + 'px 0 0',
                    'textAlign': 'left',
                    'wordWrap': 'break-word'
                });


                var author;
                if (typeof data.author !== 'undefined') {
                    author = data.author.username;
                }
                else {
                    author = data.guestAuthor;
                }
                message.data('author', author);


                message.append(createAvatar(data));
                message.append(createInformation(data));
                message.append(createAuthor(data));
                message.append(createMessageContent(data));


                return message;
            };
     

            /**
             * Creates an avatar for insertion into messages.
             * @param {Object} data - A message JSON object.
             * @returns {Object} - An HTMLObject with necessary attributes and content.
             * @readonly
             */
            var createAvatar = function(data) {
                var avatar = new Element('img'),
                    avatarSrc;


                if (typeof data.author !== 'undefined' && typeof data.author.avatar !== 'undefined') {
                    avatarSrc = data.author.avatar;
                }
                else {
                    avatarSrc = settings.defaultAvatar;
                }


                avatar.addClass('avatar');
                avatar.setAttributes({
                    width: '35',
                    height: '35',
                    src: avatarSrc
                });
                avatar.css({
                    'float': 'left',
                    'margin': '0 ' + settings.spacing + 'px ' + settings.spacing + 'px 0',
                    'MozUserSelect': 'none',
                    'webkitUserSelect': 'none',
                    'msUserSelect': 'none',
                    'userSelect': 'none'
                });


                return avatar;
            };


            /**
             * Creates an avatar for insertion into messages.
             * @param {Object} data - A message JSON object.
             * @returns {Object} - An HTMLObject with necessary attributes and content.
             * @readonly
             */
            var createInformation = function(data) {
                var information = new Element('div');
                information.addClass('information');
                information.css({
                    'fontSize': '65%',
                    'textAlign': 'right',
                });
                information.appendText(formatDate(data.date));


                if (settings.role === 'admin' || settings.role === 'mod') {
                    information.setAttribute('title', 'IP: ' + addressFromInt(data.ip_address));
                    var deleteLink = new Element('a');
                    deleteLink.addClass('delete-message');
                    deleteLink.addClass('fa');
                    deleteLink.addClass('fa-trash-o');
                    deleteLink.setAttribute('href', '#');
                    deleteLink.css({
                        'display': 'inline-block',
                        'margin': '0 ' + settings.spacing + 'px',
                        'textDecoration': 'none'
                    });
                    deleteLink.on('click', function(event) {
                        event.preventDefault();
                        socket.emit('deleteMessage', event.target.parentNode.parentNode.id);
                    });


                    information.append(deleteLink);
                }


                return information;
            };


            /**
             * Creates an element to display the author's name and link.
             * @param {Object} data - A message JSON object.
             * @returns {Object} - An HTMLObject with necessary attributes and content.
             * @readonly
             */
            var createAuthor = function(data) {
                var authorElement = new Element('span');
                authorElement.addClass('author');


                if (typeof data.author !== 'undefined') {
                    if (typeof data.author.link !== 'undefined' && data.author.link !== null) {
                        var authorLink = new Element('a');
                        authorLink.setAttribute('href', data.author.link);
                        authorLink.appendText(data.author.username);
                        authorElement.append(authorLink);
                    }
                    else {
                        authorElement.appendText(data.author.username);
                    }
                }
                else {
                    authorElement.appendText(data.guestAuthor);
                }
                authorElement.appendText(': ');


                return authorElement;
            };


            /**
             * Creates an element to display a message's content.
             * @param {Object} data - A message JSON object.
             * @returns {Object} - An HTMLObject with necessary attributes and content.
             * @readonly
             */
            var createMessageContent = function(data) {
                var messageContentElement = new Element('span');
                messageContentElement.addClass('content');
                messageContentElement.appendText(data.message);


                return messageContentElement;
            };


            /**
             * @param {Object}   data                   - A message object in JSON format.
             * @param {boolean} [forceScroll]           - Whether or not to force scroll the message list. Optional.
             * @param {argumentlessCallback} [callback] - A callback to execute. Optional.
             * @readonly
             */
            var addMessage = function(data, callback) {
                messageList.append(createMessage(data));


                if (callback && typeof(callback) === 'function') {
                    return callback();
                }
            };


            /**
             * @param {Object}   data                   - A message object in JSON format.
             * @param {boolean} [forceScroll]           - Whether or not to force scroll the message list. Optional.
             * @param {argumentlessCallback} [callback] - A callback to execute. Optional.
             * @readonly
             */
            var addMessageAndScroll = function(data, forceScroll, callback) {
                var atBottom = (messageWrapper.HTMLElement.scrollHeight - messageWrapper.HTMLElement.scrollTop) === messageWrapper.HTMLElement.clientHeight;


                messageList.append(createMessage(data));
                scrollMessages(atBottom, forceScroll, settings.animateMessages);


                if (callback && typeof(callback) === 'function') {
                    return callback();
                }
            };


            /**
             * @param {Object}   data                   - A message object in JSON format.
             * @param {argumentlessCallback} [callback] - A callback to execute. Optional.
             * @readonly
             */
            var addMessageToTop = function(data, callback) {
                var messageElement = createMessage(data);
                var atBottom = (messageWrapper.HTMLElement.scrollHeight - messageWrapper.HTMLElement.scrollTop) === messageWrapper.HTMLElement.clientHeight;


                messageList.prepend(messageElement);
                messageWrapper.HTMLElement.scrollTop += messageElement.HTMLElement.clientHeight;


                if (callback && typeof(callback) === 'function') {
                    return callback();
                }
            };


            var formWrapper = new Element('div');
            formWrapper.addClass('form-wrapper');
            formWrapper.css({
                'backgroundColor': '#eaeaea',
                'display': 'inline-block',
                'float': 'left',
                'height': (settings.height - 96) + 'px',
                'left': ((settings.width - (settings.spacing * 4)) + (settings.spacing * 2)) + 'px',
                'margin': (settings.spacing * 2) + 'px ' + (settings.spacing * 2) + 'px -' + ((settings.height - 96) + (settings.spacing * 4)) + 'px',
                'position': 'relative',
                'top': '-' + ((settings.height - 96) + (settings.spacing * 4)) + 'px',
                'width': (settings.width - (settings.spacing * 4)) + 'px'
            });
            container.append(formWrapper);


            var onlineListWrapper = new Element('div');
            onlineListWrapper.addClass('onlineList-wrapper');
            onlineListWrapper.css({
                'backgroundColor': '#eaeaea',
                'display': 'inline-block',
                'float': 'left',
                'height': (settings.height - 96) + 'px',
                'left': '-' + ((settings.width - (settings.spacing * 4)) + (settings.spacing * 2)) + 'px',
                'margin': (settings.spacing * 2) + 'px ' + (settings.spacing * 2) + 'px -' + ((settings.height - 96) + (settings.spacing * 4)) + 'px',
                'position': 'relative',
                'top': '-' + ((settings.height - 96) + (settings.spacing * 4)) + 'px',
                'width': (settings.width - (settings.spacing * 4)) + 'px'
            });
            container.append(onlineListWrapper);


            var chatForm = new Element('form');
            chatForm.css({
                'display': 'block',
                'margin': '0 ' + (settings.spacing * 2 ) + 'px ' + settings.spacing + 'px'
            });
            container.append(chatForm);
            var chatTextarea = new Element('textarea');
            chatTextarea.setAttributes({
                'placeholder': 'Type your message here...',
                'disabled': 'true'
            });
            chatTextarea.css({
                'boxSizing': 'border-box',
                'fontFamily': 'inherit',
                'fontSize': 'inherit',
                'height': '56px',
                'padding': settings.spacing + 'px',
                'resize': 'none',
                'width': (settings.width - (settings.spacing * 4)) + 'px'
            });
            chatForm.append(chatTextarea);


            var chatFormSubmit = new Event('submit', {
                bubbles: true,
                cancelable: true
            });


            /**
             * Determines whether the key associated with a keypress event is the enter key.
             * @param {Object} event - A keypress event.
             * @returns {boolean} - Whether or not the pressed key is a match for the enter key.
             * @readonly
             */
            var isSubmitKey = function(event) {
                return (event.key === 'Enter' || event.keyCode === 13);
            };


            chatTextarea.on('keyup', function(event) {
                if (isSubmitKey(event)) {
                   chatForm.HTMLElement.dispatchEvent(chatFormSubmit);
                }
            });
            chatTextarea.on('keydown', function(event) {
                if (isSubmitKey(event)) {
                   event.preventDefault();
                }
            });


            var enableTextarea = function() {
                chatTextarea.removeAttribute('disabled');
            };
            var disableTextarea = function() {
                chatTextarea.setAttribute('disabled', 'true');
            };
            var resetTextarea = function() {
                chatTextarea.HTMLElement.value = '';
            };
            var focusTextarea = function() {
                chatTextarea.HTMLElement.focus();
            };
            chatForm.on('submit', function(event) {
                event.preventDefault();
                disableTextarea();
                socket.emit('sendMessage', chatTextarea.HTMLElement.value);
            });


            /**
             * Socket event functions wrapper.
             * @namespace
             * @method sessionStart       - Incoming session data from the server.
             * @method initialMessages    - Initial message data used to populate chat.
             * @method additionalMessages - Additional message data used to populate chat history.
             * @readonly
             */
            var SocketEvents = {


                /**
                 * Loads session data from server into a cookie and enables the textarea.
                 * @param data - Current session data in JSON format.
                 * @readonly
                 */
                sessionStart: function(data) {
                    setCookie('taka-session_id', data.id);
                    settings.role = data.role;
                    console.log(data);
                    enableTextarea();
                },


                /**
                 * Populates the chat history with the most recent messages.
                 * @param data - An array of message JSON objects.
                 * @readonly
                 */
                initialMessages: function(data) {
                    data = data.reverse();
                    for (var i = 0, numMessages = data.length; i < numMessages; i++) {
                        addMessage(data[i]);
                    }
                    messageWrapper.HTMLElement.scrollTop = messageWrapper.HTMLElement.scrollHeight;
                },


                /**
                 * Populates the chat history with older messages.
                 * @param data - An array of message JSON objects.
                 * @readonly
                 */
                additionalMessages: function(data) {
                    for (var i = 0, numMessages = data.length; i < numMessages; i++) {
                        addMessageToTop(data[i]);
                    }
                },


                /**
                 * Adds a new message from another client to the chat history.
                 * @param data - An array of message JSON objects.
                 * @readonly
                 */
                newMessage: function(data) {
                    addMessageAndScroll(data);
                    notify();
                },


                /**
                 * Adds a new message from this client to the chat history.
                 * @param data - An array of message JSON objects.
                 * @readonly
                 */
                confirmMessage: function(data) {
                    addMessageAndScroll(data);
                    enableTextarea();
                    resetTextarea();
                    focusTextarea();
                }
            };


            replaceScript(settings.currentScript, container);


            socket.on('sessionStart', SocketEvents.sessionStart);
            socket.on('initialMessages', SocketEvents.initialMessages);
            socket.on('additionalMessages', SocketEvents.additionalMessages);
            socket.on('newMessage', SocketEvents.newMessage);
            socket.on('confirmMessage', SocketEvents.confirmMessage);
        });
    };


    return new Chat();
};