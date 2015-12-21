'use strict';


var taka = taka || function(settings) {


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
        this.attribute = function(attribute, value) {
            this.HTMLElement[String(attribute)] = String(value);
            return this;
        };


        /**
         * Adds all the specified attributes to the element.
         * @param {Object} attributes - An object of attributes in key-value pairs.
         * @returns {this}
         * @readonly
         */
        this.attributes = function(attributes) {
            for (var attribute in attributes) {
                this.HTMLElement[String(attribute)] = String(attributes[attribute]);
            }
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


        injectDependencies(function() {
            var socket = io(settings.protocol + settings.host, {
                path: settings.path,
                query: settings.query
            });


            var container = new Element('div');
            container.attribute('id', 'taka');
            container.css({
                width: settings.width + 'px',
                height: settings.height + 'px'
            });


            var notificationHandler = new Element('audio');
            notificationHandler.attributes({
                preload: 'auto',
                volume: '1'
            });
            var mp3 = new Element('source');
            mp3.attributes({
                src: settings.audio.mp3,
                type: 'audio/mpeg'
            });
            notificationHandler.append(mp3);
            var ogg = new Element('source');
            ogg.attributes({
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
                height: (settings.height - 96) + 'px',
                width: (settings.width - 16) + 'px'
            });
            messageWrapper.on('scroll', function(event) {
                if (messageWrapper.HTMLElement.scrollTop === 0) {
                    socket.emit('loadMessages');
                }
            });
            var messageList = new Element('div');
            messageList.addClass('message-list');
            messageWrapper.append(messageList);
            container.append(messageWrapper);


            /**
             * Scrolls the message wrapper to the bottom.
             * @param {boolean} atBottom      - Whether or not the message wrapper is scrolled to the bottom.
             * @param {boolean} [forceScroll] - Whether or not to scroll to the bottom anyway. Optional.
             */
            var scrollMessages = function(atBottom, forceScroll) {
                if (typeof forceScroll === 'undefined') {
                    forceScroll = false;
                }


                if (atBottom || forceScroll) {
                    messageWrapper.HTMLElement.scrollTop = messageWrapper.HTMLElement.scrollHeight;
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
                message.attribute('id', data._id);


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
                avatar.attributes({
                    width: '35',
                    height: '35',
                    src: avatarSrc
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
                information.appendText(formatDate(data.date));


                if (settings.role === 'admin' || settings.role === 'mod') {
                    information.attribute('title', 'IP: ' + addressFromInt(data.ip_address));
                    var deleteLink = new Element('a');
                    deleteLink.addClass('delete-message');
                    deleteLink.addClass('fa');
                    deleteLink.addClass('fa-trash-o');
                    deleteLink.attribute('href', '#');
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
                        authorLink.attribute('href', data.author.link);
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
            var addMessage = function(data, forceScroll, callback) {
                var atBottom = (messageWrapper.HTMLElement.scrollHeight - messageWrapper.HTMLElement.scrollTop) === messageWrapper.HTMLElement.clientHeight;


                messageList.append(createMessage(data));
                scrollMessages(atBottom, forceScroll);


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


            /**
             * Socket event functions wrapper.
             * @namespace
             * @method sessionStart    - Incoming session data from the server.
             * @method initialMessages - Initial message data used to populate chat.
             * @readonly
             */
            var SocketEvents = {


                /**
                 * @param data - Current session data in JSON format.
                 * @readonly
                 */
                sessionStart: function(data) {
                    setCookie('taka-session_id', data.id);
                    settings.role = data.role;
                    console.log(data);
                },


                /**
                 * @param data - An array of message JSON objects.
                 * @readonly
                 */
                initialMessages: function(data) {
                    console.log(data);
                },

                message: function(data) {
                    addMessage(data);
                    notify();
                }
            };


            replaceScript(settings.currentScript, container);


            socket.on('sessionStart', SocketEvents.sessionStart);
            socket.on('initialMessages', SocketEvents.initialMessages);
            socket.on('message', SocketEvents.message);
        });
    };


    return new Chat();
};