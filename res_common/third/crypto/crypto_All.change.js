(function(win){ var oui = win.oui ||{};win.oui=oui;var _oui_oed =null;/**
 * _oui_oed core components.
 */
var _oui_oed = _oui_oed || (function (Math, undefined) {
    /*
     * Local polyfil of Object.create
     */
    var create = Object.create || (function () {
        function F() {};

        return function (obj) {
            var subtype;

            F.prototype = obj;

            subtype = new F();

            F.prototype = null;

            return subtype;
        };
    }())

    /**
     * _oui_oed namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {


        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = _oui_oed.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                var subtype = create(this);

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Create default initializer
                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }

                // Initializer's prototype is the subtype object
                subtype.init.prototype = subtype;

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = _oui_oed.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = _oui_oed.lib.WordArray.create();
         *     var wordArray = _oui_oed.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = _oui_oed.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: _oui_oed.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(_oui_oed.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];

            var r = (function (m_w) {
                var m_w = m_w;
                var m_z = 0x3ade68b1;
                var mask = 0xffffffff;

                return function () {
                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                    var result = ((m_z << 0x10) + m_w) & mask;
                    result /= 0x100000000;
                    result += 0.5;
                    return result * (Math.random() > .5 ? 1 : -1);
                }
            });

            for (var i = 0, rcache; i < nBytes; i += 4) {
                var _r = r((rcache || Math.random()) * 0x100000000);

                rcache = _r() * 0x3ade67b7;
                words.push((_r() * 0x100000000) | 0);
            }

            return new WordArray.init(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = _oui_oed.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = _oui_oed.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = _oui_oed.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = _oui_oed.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = _oui_oed.lib.Hasher._createHelper(_oui_oed.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = _oui_oed.lib.Hasher._createHmacHelper(_oui_oed.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));
;
(function () {
    // Check if typed arrays are supported
    if (typeof ArrayBuffer != 'function') {
        return;
    }

    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;

    // Reference original init
    var superInit = WordArray.init;

    // Augment WordArray.init to handle typed arrays
    var subInit = WordArray.init = function (typedArray) {
        // Convert buffers to uint8
        if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
        }

        // Convert other array views to uint8
        if (
            typedArray instanceof Int8Array ||
            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
            typedArray instanceof Int16Array ||
            typedArray instanceof Uint16Array ||
            typedArray instanceof Int32Array ||
            typedArray instanceof Uint32Array ||
            typedArray instanceof Float32Array ||
            typedArray instanceof Float64Array
        ) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        }

        // Handle Uint8Array
        if (typedArray instanceof Uint8Array) {
            // Shortcut
            var typedArrayByteLength = typedArray.byteLength;

            // Extract bytes
            var words = [];
            for (var i = 0; i < typedArrayByteLength; i++) {
                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
            }

            // Initialize this word array
            superInit.call(this, words, typedArrayByteLength);
        } else {
            // Else call normal init
            superInit.apply(this, arguments);
        }
    };

    subInit.prototype = WordArray;
}());
;
(function (undefined) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var X32WordArray = C_lib.WordArray;

    /**
     * x64 namespace.
     */
    var C_x64 = C.x64 = {};

    /**
     * A 64-bit word.
     */
    var X64Word = C_x64.Word = Base.extend({
        /**
         * Initializes a newly created 64-bit word.
         *
         * @param {number} high The high 32 bits.
         * @param {number} low The low 32 bits.
         *
         * @example
         *
         *     var x64Word = _oui_oed.x64.Word.create(0x00010203, 0x04050607);
         */
        init: function (high, low) {
            this.high = high;
            this.low = low;
        }

        /**
         * Bitwise NOTs this word.
         *
         * @return {X64Word} A new x64-Word object after negating.
         *
         * @example
         *
         *     var negated = x64Word.not();
         */
        // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;

            // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ANDs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to AND with this word.
         *
         * @return {X64Word} A new x64-Word object after ANDing.
         *
         * @example
         *
         *     var anded = x64Word.and(anotherX64Word);
         */
        // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;

            // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to OR with this word.
         *
         * @return {X64Word} A new x64-Word object after ORing.
         *
         * @example
         *
         *     var ored = x64Word.or(anotherX64Word);
         */
        // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;

            // return X64Word.create(high, low);
        // },

        /**
         * Bitwise XORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to XOR with this word.
         *
         * @return {X64Word} A new x64-Word object after XORing.
         *
         * @example
         *
         *     var xored = x64Word.xor(anotherX64Word);
         */
        // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;

            // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the left.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftL(25);
         */
        // shiftL: function (n) {
            // if (n < 32) {
                // var high = (this.high << n) | (this.low >>> (32 - n));
                // var low = this.low << n;
            // } else {
                // var high = this.low << (n - 32);
                // var low = 0;
            // }

            // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the right.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftR(7);
         */
        // shiftR: function (n) {
            // if (n < 32) {
                // var low = (this.low >>> n) | (this.high << (32 - n));
                // var high = this.high >>> n;
            // } else {
                // var low = this.high >>> (n - 32);
                // var high = 0;
            // }

            // return X64Word.create(high, low);
        // },

        /**
         * Rotates this word n bits to the left.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotL(25);
         */
        // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
        // },

        /**
         * Rotates this word n bits to the right.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotR(7);
         */
        // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
        // },

        /**
         * Adds this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to add with this word.
         *
         * @return {X64Word} A new x64-Word object after adding.
         *
         * @example
         *
         *     var added = x64Word.add(anotherX64Word);
         */
        // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;

            // return X64Word.create(high, low);
        // }
    });

    /**
     * An array of 64-bit words.
     *
     * @property {Array} words The array of _oui_oed.x64.Word objects.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var X64WordArray = C_x64.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of _oui_oed.x64.Word objects.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = _oui_oed.x64.WordArray.create();
         *
         *     var wordArray = _oui_oed.x64.WordArray.create([
         *         _oui_oed.x64.Word.create(0x00010203, 0x04050607),
         *         _oui_oed.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ]);
         *
         *     var wordArray = _oui_oed.x64.WordArray.create([
         *         _oui_oed.x64.Word.create(0x00010203, 0x04050607),
         *         _oui_oed.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ], 10);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 8;
            }
        },

        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {_oui_oed.lib.WordArray} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        toX32: function () {
            // Shortcuts
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;

            // Convert
            var x32Words = [];
            for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
            }

            return X32WordArray.create(x32Words, this.sigBytes);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {X64WordArray} The clone.
         *
         * @example
         *
         *     var clone = x64WordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);

            // Clone "words" array
            var words = clone.words = this.words.slice(0);

            // Clone each X64Word object
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
            }

            return clone;
        }
    });
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * UTF-16 BE encoding strategy.
     */
    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
        /**
         * Converts a word array to a UTF-16 BE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 BE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16String = _oui_oed.enc.Utf16.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
                utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 BE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 BE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Utf16.parse(utf16String);
         */
        parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
            }

            return WordArray.create(words, utf16StrLength * 2);
        }
    };

    /**
     * UTF-16 LE encoding strategy.
     */
    C_enc.Utf16LE = {
        /**
         * Converts a word array to a UTF-16 LE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 LE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16Str = _oui_oed.enc.Utf16LE.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
                utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 LE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 LE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Utf16LE.parse(utf16Str);
         */
        parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
            }

            return WordArray.create(words, utf16StrLength * 2);
        }
    };

    function swapEndian(word) {
        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
    }
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = _oui_oed.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = _oui_oed.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
                    reverseMap = this._reverseMap = [];
                    for (var j = 0; j < map.length; j++) {
                        reverseMap[map.charCodeAt(j)] = j;
                    }
            }

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            return parseLoop(base64Str, base64StrLength, reverseMap);

        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };

    function parseLoop(base64Str, base64StrLength, reverseMap) {
      var words = [];
      var nBytes = 0;
      for (var i = 0; i < base64StrLength; i++) {
          if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
              nBytes++;
          }
      }
      return WordArray.create(words, nBytes);
    }
}());
;
(function (Math) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants table
    var T = [];

    // Compute constants
    (function () {
        for (var i = 0; i < 64; i++) {
            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
    }());

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                M[offset_i] = (
                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcuts
            var H = this._hash.words;

            var M_offset_0  = M[offset + 0];
            var M_offset_1  = M[offset + 1];
            var M_offset_2  = M[offset + 2];
            var M_offset_3  = M[offset + 3];
            var M_offset_4  = M[offset + 4];
            var M_offset_5  = M[offset + 5];
            var M_offset_6  = M[offset + 6];
            var M_offset_7  = M[offset + 7];
            var M_offset_8  = M[offset + 8];
            var M_offset_9  = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];

            // Working varialbes
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
            d = II(d, a, b, c, M_offset_7,  10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5,  21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
            d = II(d, a, b, c, M_offset_3,  10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1,  21, T[55]);
            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6,  15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2,  15, T[62]);
            b = II(b, c, d, a, M_offset_9,  21, T[63]);

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
            );
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
            );

            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.MD5('message');
     *     var hash = _oui_oed.MD5(wordArray);
     */
    C.MD5 = Hasher._createHelper(MD5);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacMD5(message, key);
     */
    C.HmacMD5 = Hasher._createHmacHelper(MD5);
}(Math));
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Reusable object
    var W = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476,
                0xc3d2e1f0
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            // Computation
            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                    W[i] = (n << 1) | (n >>> 31);
                }

                var t = ((a << 5) | (a >>> 27)) + e + W[i];
                if (i < 20) {
                    t += ((b & c) | (~b & d)) + 0x5a827999;
                } else if (i < 40) {
                    t += (b ^ c ^ d) + 0x6ed9eba1;
                } else if (i < 60) {
                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                } else /* if (i < 80) */ {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                }

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA1('message');
     *     var hash = _oui_oed.SHA1(wordArray);
     */
    C.SHA1 = Hasher._createHelper(SHA1);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA1(message, key);
     */
    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
}());
;
(function (Math) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object
    var W = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                   (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                   (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA256('message');
     *     var hash = _oui_oed.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA256(message, key);
     */
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var SHA256 = C_algo.SHA256;

    /**
     * SHA-224 hash algorithm.
     */
    var SHA224 = C_algo.SHA224 = SHA256.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
            ]);
        },

        _doFinalize: function () {
            var hash = SHA256._doFinalize.call(this);

            hash.sigBytes -= 4;

            return hash;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA224('message');
     *     var hash = _oui_oed.SHA224(wordArray);
     */
    C.SHA224 = SHA256._createHelper(SHA224);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA224(message, key);
     */
    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Hasher = C_lib.Hasher;
    var C_x64 = C.x64;
    var X64Word = C_x64.Word;
    var X64WordArray = C_x64.WordArray;
    var C_algo = C.algo;

    function X64Word_create() {
        return X64Word.create.apply(X64Word, arguments);
    }

    // Constants
    var K = [
        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
    ];

    // Reusable objects
    var W = [];
    (function () {
        for (var i = 0; i < 80; i++) {
            W[i] = X64Word_create();
        }
    }());

    /**
     * SHA-512 hash algorithm.
     */
    var SHA512 = C_algo.SHA512 = Hasher.extend({
        _doReset: function () {
            this._hash = new X64WordArray.init([
                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcuts
            var H = this._hash.words;

            var H0 = H[0];
            var H1 = H[1];
            var H2 = H[2];
            var H3 = H[3];
            var H4 = H[4];
            var H5 = H[5];
            var H6 = H[6];
            var H7 = H[7];

            var H0h = H0.high;
            var H0l = H0.low;
            var H1h = H1.high;
            var H1l = H1.low;
            var H2h = H2.high;
            var H2l = H2.low;
            var H3h = H3.high;
            var H3l = H3.low;
            var H4h = H4.high;
            var H4l = H4.low;
            var H5h = H5.high;
            var H5l = H5.low;
            var H6h = H6.high;
            var H6l = H6.low;
            var H7h = H7.high;
            var H7l = H7.low;

            // Working variables
            var ah = H0h;
            var al = H0l;
            var bh = H1h;
            var bl = H1l;
            var ch = H2h;
            var cl = H2l;
            var dh = H3h;
            var dl = H3l;
            var eh = H4h;
            var el = H4l;
            var fh = H5h;
            var fl = H5l;
            var gh = H6h;
            var gl = H6l;
            var hh = H7h;
            var hl = H7l;

            // Rounds
            for (var i = 0; i < 80; i++) {
                // Shortcut
                var Wi = W[i];

                // Extend message
                if (i < 16) {
                    var Wih = Wi.high = M[offset + i * 2]     | 0;
                    var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
                } else {
                    // Gamma0
                    var gamma0x  = W[i - 15];
                    var gamma0xh = gamma0x.high;
                    var gamma0xl = gamma0x.low;
                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

                    // Gamma1
                    var gamma1x  = W[i - 2];
                    var gamma1xh = gamma1x.high;
                    var gamma1xl = gamma1x.low;
                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                    var Wi7  = W[i - 7];
                    var Wi7h = Wi7.high;
                    var Wi7l = Wi7.low;

                    var Wi16  = W[i - 16];
                    var Wi16h = Wi16.high;
                    var Wi16l = Wi16.low;

                    var Wil = gamma0l + Wi7l;
                    var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                    var Wil = Wil + gamma1l;
                    var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                    var Wil = Wil + Wi16l;
                    var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

                    Wi.high = Wih;
                    Wi.low  = Wil;
                }

                var chh  = (eh & fh) ^ (~eh & gh);
                var chl  = (el & fl) ^ (~el & gl);
                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

                // t1 = h + sigma1 + ch + K[i] + W[i]
                var Ki  = K[i];
                var Kih = Ki.high;
                var Kil = Ki.low;

                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

                // t2 = sigma0 + maj
                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

                // Update working variables
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = (dl + t1l) | 0;
                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = (t1l + t2l) | 0;
                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
            }

            // Intermediate hash value
            H0l = H0.low  = (H0l + al);
            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
            H1l = H1.low  = (H1l + bl);
            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
            H2l = H2.low  = (H2l + cl);
            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
            H3l = H3.low  = (H3l + dl);
            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
            H4l = H4.low  = (H4l + el);
            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
            H5l = H5.low  = (H5l + fl);
            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
            H6l = H6.low  = (H6l + gl);
            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
            H7l = H7.low  = (H7l + hl);
            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Convert hash to 32-bit word array before returning
            var hash = this._hash.toX32();

            // Return final computed hash
            return hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        },

        blockSize: 1024/32
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA512('message');
     *     var hash = _oui_oed.SHA512(wordArray);
     */
    C.SHA512 = Hasher._createHelper(SHA512);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA512(message, key);
     */
    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_x64 = C.x64;
    var X64Word = C_x64.Word;
    var X64WordArray = C_x64.WordArray;
    var C_algo = C.algo;
    var SHA512 = C_algo.SHA512;

    /**
     * SHA-384 hash algorithm.
     */
    var SHA384 = C_algo.SHA384 = SHA512.extend({
        _doReset: function () {
            this._hash = new X64WordArray.init([
                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
            ]);
        },

        _doFinalize: function () {
            var hash = SHA512._doFinalize.call(this);

            hash.sigBytes -= 16;

            return hash;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA384('message');
     *     var hash = _oui_oed.SHA384(wordArray);
     */
    C.SHA384 = SHA512._createHelper(SHA384);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA384(message, key);
     */
    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
}());
;
(function (Math) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_x64 = C.x64;
    var X64Word = C_x64.Word;
    var C_algo = C.algo;

    // Constants tables
    var RHO_OFFSETS = [];
    var PI_INDEXES  = [];
    var ROUND_CONSTANTS = [];

    // Compute Constants
    (function () {
        // Compute rho offset constants
        var x = 1, y = 0;
        for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
        }

        // Compute pi index constants
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
            }
        }

        // Compute round constants
        var LFSR = 0x01;
        for (var i = 0; i < 24; i++) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;

            for (var j = 0; j < 7; j++) {
                if (LFSR & 0x01) {
                    var bitPosition = (1 << j) - 1;
                    if (bitPosition < 32) {
                        roundConstantLsw ^= 1 << bitPosition;
                    } else /* if (bitPosition >= 32) */ {
                        roundConstantMsw ^= 1 << (bitPosition - 32);
                    }
                }

                // Compute next LFSR
                if (LFSR & 0x80) {
                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                    LFSR = (LFSR << 1) ^ 0x71;
                } else {
                    LFSR <<= 1;
                }
            }

            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
        }
    }());

    // Reusable objects for temporary values
    var T = [];
    (function () {
        for (var i = 0; i < 25; i++) {
            T[i] = X64Word.create();
        }
    }());

    /**
     * SHA-3 hash algorithm.
     */
    var SHA3 = C_algo.SHA3 = Hasher.extend({
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   Only values permitted are: 224, 256, 384, 512.
         *   Default: 512
         */
        cfg: Hasher.cfg.extend({
            outputLength: 512
        }),

        _doReset: function () {
            var state = this._state = []
            for (var i = 0; i < 25; i++) {
                state[i] = new X64Word.init();
            }

            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
        },

        _doProcessBlock: function (M, offset) {
            // Shortcuts
            var state = this._state;
            var nBlockSizeLanes = this.blockSize / 2;

            // Absorb
            for (var i = 0; i < nBlockSizeLanes; i++) {
                // Shortcuts
                var M2i  = M[offset + 2 * i];
                var M2i1 = M[offset + 2 * i + 1];

                // Swap endian
                M2i = (
                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
                );
                M2i1 = (
                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
                );

                // Absorb message into state
                var lane = state[i];
                lane.high ^= M2i1;
                lane.low  ^= M2i;
            }

            // Rounds
            for (var round = 0; round < 24; round++) {
                // Theta
                for (var x = 0; x < 5; x++) {
                    // Mix column lanes
                    var tMsw = 0, tLsw = 0;
                    for (var y = 0; y < 5; y++) {
                        var lane = state[x + 5 * y];
                        tMsw ^= lane.high;
                        tLsw ^= lane.low;
                    }

                    // Temporary values
                    var Tx = T[x];
                    Tx.high = tMsw;
                    Tx.low  = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                    // Shortcuts
                    var Tx4 = T[(x + 4) % 5];
                    var Tx1 = T[(x + 1) % 5];
                    var Tx1Msw = Tx1.high;
                    var Tx1Lsw = Tx1.low;

                    // Mix surrounding columns
                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                    for (var y = 0; y < 5; y++) {
                        var lane = state[x + 5 * y];
                        lane.high ^= tMsw;
                        lane.low  ^= tLsw;
                    }
                }

                // Rho Pi
                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                    // Shortcuts
                    var lane = state[laneIndex];
                    var laneMsw = lane.high;
                    var laneLsw = lane.low;
                    var rhoOffset = RHO_OFFSETS[laneIndex];

                    // Rotate lanes
                    if (rhoOffset < 32) {
                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                    } else /* if (rhoOffset >= 32) */ {
                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
                    }

                    // Transpose lanes
                    var TPiLane = T[PI_INDEXES[laneIndex]];
                    TPiLane.high = tMsw;
                    TPiLane.low  = tLsw;
                }

                // Rho pi at x = y = 0
                var T0 = T[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low  = state0.low;

                // Chi
                for (var x = 0; x < 5; x++) {
                    for (var y = 0; y < 5; y++) {
                        // Shortcuts
                        var laneIndex = x + 5 * y;
                        var lane = state[laneIndex];
                        var TLane = T[laneIndex];
                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

                        // Mix rows
                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
                    }
                }

                // Iota
                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low  ^= roundConstant.low;;
            }
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var state = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8;

            // Squeeze
            var hashWords = [];
            for (var i = 0; i < outputLengthLanes; i++) {
                // Shortcuts
                var lane = state[i];
                var laneMsw = lane.high;
                var laneLsw = lane.low;

                // Swap endian
                laneMsw = (
                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
                );
                laneLsw = (
                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
                );

                // Squeeze state to retrieve hash
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
            }

            // Return final computed hash
            return new WordArray.init(hashWords, outputLengthBytes);
        },

        clone: function () {
            var clone = Hasher.clone.call(this);

            var state = clone._state = this._state.slice(0);
            for (var i = 0; i < 25; i++) {
                state[i] = state[i].clone();
            }

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.SHA3('message');
     *     var hash = _oui_oed.SHA3(wordArray);
     */
    C.SHA3 = Hasher._createHelper(SHA3);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacSHA3(message, key);
     */
    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
}(Math));
;
/** @preserve
(c) 2012 by Cédric Mesnil. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (Math) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants table
    var _zl = WordArray.create([
        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
    var _zr = WordArray.create([
        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
    var _sl = WordArray.create([
         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
    var _sr = WordArray.create([
        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

    /**
     * RIPEMD160 hash algorithm.
     */
    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
        _doReset: function () {
            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
        },

        _doProcessBlock: function (M, offset) {

            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                // Swap
                M[offset_i] = (
                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                );
            }
            // Shortcut
            var H  = this._hash.words;
            var hl = _hl.words;
            var hr = _hr.words;
            var zl = _zl.words;
            var zr = _zr.words;
            var sl = _sl.words;
            var sr = _sr.words;

            // Working variables
            var al, bl, cl, dl, el;
            var ar, br, cr, dr, er;

            ar = al = H[0];
            br = bl = H[1];
            cr = cl = H[2];
            dr = dl = H[3];
            er = el = H[4];
            // Computation
            var t;
            for (var i = 0; i < 80; i += 1) {
                t = (al +  M[offset+zl[i]])|0;
                if (i<16){
	            t +=  f1(bl,cl,dl) + hl[0];
                } else if (i<32) {
	            t +=  f2(bl,cl,dl) + hl[1];
                } else if (i<48) {
	            t +=  f3(bl,cl,dl) + hl[2];
                } else if (i<64) {
	            t +=  f4(bl,cl,dl) + hl[3];
                } else {// if (i<80) {
	            t +=  f5(bl,cl,dl) + hl[4];
                }
                t = t|0;
                t =  rotl(t,sl[i]);
                t = (t+el)|0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t;

                t = (ar + M[offset+zr[i]])|0;
                if (i<16){
	            t +=  f5(br,cr,dr) + hr[0];
                } else if (i<32) {
	            t +=  f4(br,cr,dr) + hr[1];
                } else if (i<48) {
	            t +=  f3(br,cr,dr) + hr[2];
                } else if (i<64) {
	            t +=  f2(br,cr,dr) + hr[3];
                } else {// if (i<80) {
	            t +=  f1(br,cr,dr) + hr[4];
                }
                t = t|0;
                t =  rotl(t,sr[i]) ;
                t = (t+er)|0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t;
            }
            // Intermediate hash value
            t    = (H[1] + cl + dr)|0;
            H[1] = (H[2] + dl + er)|0;
            H[2] = (H[3] + el + ar)|0;
            H[3] = (H[4] + al + br)|0;
            H[4] = (H[0] + bl + cr)|0;
            H[0] =  t;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
            );
            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 5; i++) {
                // Shortcut
                var H_i = H[i];

                // Swap
                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });


    function f1(x, y, z) {
        return ((x) ^ (y) ^ (z));

    }

    function f2(x, y, z) {
        return (((x)&(y)) | ((~x)&(z)));
    }

    function f3(x, y, z) {
        return (((x) | (~(y))) ^ (z));
    }

    function f4(x, y, z) {
        return (((x) & (z)) | ((y)&(~(z))));
    }

    function f5(x, y, z) {
        return ((x) ^ ((y) |(~(z))));

    }

    function rotl(x,n) {
        return (x<<n) | (x>>>(32-n));
    }


    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = _oui_oed.RIPEMD160('message');
     *     var hash = _oui_oed.RIPEMD160(wordArray);
     */
    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = _oui_oed.HmacRIPEMD160(message, key);
     */
    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
}(Math));
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var C_algo = C.algo;

    /**
     * HMAC algorithm.
     */
    var HMAC = C_algo.HMAC = Base.extend({
        /**
         * Initializes a newly created HMAC.
         *
         * @param {Hasher} hasher The hash algorithm to use.
         * @param {WordArray|string} key The secret key.
         *
         * @example
         *
         *     var hmacHasher = _oui_oed.algo.HMAC.create(_oui_oed.algo.SHA256, key);
         */
        init: function (hasher, key) {
            // Init hasher
            hasher = this._hasher = new hasher.init();

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = Utf8.parse(key);
            }

            // Shortcuts
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;

            // Allow arbitrary length keys
            if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
            }

            // Clamp excess bits
            key.clamp();

            // Clone key for inner and outer pads
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this HMAC to its initial state.
         *
         * @example
         *
         *     hmacHasher.reset();
         */
        reset: function () {
            // Shortcut
            var hasher = this._hasher;

            // Reset
            hasher.reset();
            hasher.update(this._iKey);
        },

        /**
         * Updates this HMAC with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {HMAC} This HMAC instance.
         *
         * @example
         *
         *     hmacHasher.update('message');
         *     hmacHasher.update(wordArray);
         */
        update: function (messageUpdate) {
            this._hasher.update(messageUpdate);

            // Chainable
            return this;
        },

        /**
         * Finalizes the HMAC computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The HMAC.
         *
         * @example
         *
         *     var hmac = hmacHasher.finalize();
         *     var hmac = hmacHasher.finalize('message');
         *     var hmac = hmacHasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Shortcut
            var hasher = this._hasher;

            // Compute HMAC
            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

            return hmac;
        }
    });
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var SHA1 = C_algo.SHA1;
    var HMAC = C_algo.HMAC;

    /**
     * Password-Based Key Derivation Function 2 algorithm.
     */
    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
            keySize: 128/32,
            hasher: SHA1,
            iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = _oui_oed.algo.PBKDF2.create();
         *     var kdf = _oui_oed.algo.PBKDF2.create({ keySize: 8 });
         *     var kdf = _oui_oed.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init HMAC
            var hmac = HMAC.create(cfg.hasher, password);

            // Initial values
            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([0x00000001]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).finalize(blockIndex);
                hmac.reset();

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                    intermediate = hmac.finalize(intermediate);
                    hmac.reset();

                    // Shortcut
                    var intermediateWords = intermediate.words;

                    // XOR intermediate with block
                    for (var j = 0; j < blockWordsLength; j++) {
                        blockWords[j] ^= intermediateWords[j];
                    }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });

    /**
     * Computes the Password-Based Key Derivation Function 2.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     * @param {Object} cfg (Optional) The configuration options to use for this computation.
     *
     * @return {WordArray} The derived key.
     *
     * @static
     *
     * @example
     *
     *     var key = _oui_oed.PBKDF2(password, salt);
     *     var key = _oui_oed.PBKDF2(password, salt, { keySize: 8 });
     *     var key = _oui_oed.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
     */
    C.PBKDF2 = function (password, salt, cfg) {
        return PBKDF2.create(cfg).compute(password, salt);
    };
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var MD5 = C_algo.MD5;

    /**
     * This key derivation function is meant to conform with EVP_BytesToKey.
     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
     */
    var EvpKDF = C_algo.EvpKDF = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
            keySize: 128/32,
            hasher: MD5,
            iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = _oui_oed.algo.EvpKDF.create();
         *     var kdf = _oui_oed.algo.EvpKDF.create({ keySize: 8 });
         *     var kdf = _oui_oed.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init hasher
            var hasher = cfg.hasher.create();

            // Initial values
            var derivedKey = WordArray.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                if (block) {
                    hasher.update(block);
                }
                var block = hasher.update(password).finalize(salt);
                hasher.reset();

                // Iterations
                for (var i = 1; i < iterations; i++) {
                    block = hasher.finalize(block);
                    hasher.reset();
                }

                derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });

    /**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     * @param {Object} cfg (Optional) The configuration options to use for this computation.
     *
     * @return {WordArray} The derived key.
     *
     * @static
     *
     * @example
     *
     *     var key = _oui_oed.EvpKDF(password, salt);
     *     var key = _oui_oed.EvpKDF(password, salt, { keySize: 8 });
     *     var key = _oui_oed.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
     */
    C.EvpKDF = function (password, salt, cfg) {
        return EvpKDF.create(cfg).compute(password, salt);
    };
}());
;
/**
 * Cipher core components.
 */
_oui_oed.lib.Cipher || (function (undefined) {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = _oui_oed.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = _oui_oed.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = _oui_oed.algo.AES.create(_oui_oed.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-cipher logic
            this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
            // Append
            this._append(dataUpdate);

            // Process available blocks
            return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
                this._append(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
        },

        keySize: 128/32,

        ivSize: 128/32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = _oui_oed.lib.Cipher._createHelper(_oui_oed.algo.AES);
         */
        _createHelper: (function () {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }

            return function (cipher) {
                return {
                    encrypt: function (message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },

                    decrypt: function (ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            };
        }())
    });

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function () {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
        },

        blockSize: 1
    });

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * Abstract base block cipher mode template.
     */
    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = _oui_oed.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = _oui_oed.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = _oui_oed.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        }
    });

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = C_mode.CBC = (function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // XOR and encrypt
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);

                // Remember this block to use with next block
                this._prevBlock = words.slice(offset, offset + blockSize);
            }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // Remember this block to use with next block
                var thisBlock = words.slice(offset, offset + blockSize);

                // Decrypt and XOR
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);

                // This block becomes the previous block
                this._prevBlock = thisBlock;
            }
        });

        function xorBlock(words, offset, blockSize) {
            // Shortcut
            var iv = this._iv;

            // Choose mixing block
            if (iv) {
                var block = iv;

                // Remove IV for subsequent blocks
                this._iv = undefined;
            } else {
                var block = this._prevBlock;
            }

            // XOR blocks
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }

        return CBC;
    }());

    /**
     * Padding namespace.
     */
    var C_pad = C.pad = {};

    /**
     * PKCS #5/7 padding strategy.
     */
    var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     _oui_oed.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     _oui_oed.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };

    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
        }),

        reset: function () {
            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                var modeCreator = mode.createDecryptor;
                // Keep at least one block in the buffer for unpadding
                this._minBufferSize = 1;
            }

            if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
            } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
            }
        },

        _doProcessBlock: function (words, offset) {
            this._mode.processBlock(words, offset);
        },

        _doFinalize: function () {
            // Shortcut
            var padding = this.cfg.padding;

            // Finalize
            if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                padding.pad(this._data, this.blockSize);

                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');

                // Unpad data
                padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
        },

        blockSize: 128/32
    });

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = _oui_oed.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: _oui_oed.algo.AES,
         *         mode: _oui_oed.mode.CBC,
         *         padding: _oui_oed.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: _oui_oed.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(_oui_oed.format.OpenSSL);
         */
        toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = _oui_oed.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
            // Shortcuts
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = _oui_oed.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(ciphertextWords.slice(2, 4));

                // Remove salt from ciphertext
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
    };

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = _oui_oed.lib.SerializableCipher.encrypt(_oui_oed.algo.AES, message, key);
         *     var ciphertextParams = _oui_oed.lib.SerializableCipher.encrypt(_oui_oed.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = _oui_oed.lib.SerializableCipher.encrypt(_oui_oed.algo.AES, message, key, { iv: iv, format: _oui_oed.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Encrypt
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);

            // Shortcut
            var cipherCfg = encryptor.cfg;

            // Create and return serializable cipher params
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = _oui_oed.lib.SerializableCipher.decrypt(_oui_oed.algo.AES, formattedCiphertext, key, { iv: iv, format: _oui_oed.format.OpenSSL });
         *     var plaintext = _oui_oed.lib.SerializableCipher.decrypt(_oui_oed.algo.AES, ciphertextParams, key, { iv: iv, format: _oui_oed.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = _oui_oed.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
            } else {
                return ciphertext;
            }
        }
    });

    /**
     * Key derivation function namespace.
     */
    var C_kdf = C.kdf = {};

    /**
     * OpenSSL key derivation function.
     */
    var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = _oui_oed.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = _oui_oed.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function (password, keySize, ivSize, salt) {
            // Generate random salt
            if (!salt) {
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = _oui_oed.lib.PasswordBasedCipher.encrypt(_oui_oed.algo.AES, message, 'password');
         *     var ciphertextParams = _oui_oed.lib.PasswordBasedCipher.encrypt(_oui_oed.algo.AES, message, 'password', { format: _oui_oed.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = _oui_oed.lib.PasswordBasedCipher.decrypt(_oui_oed.algo.AES, formattedCiphertext, 'password', { format: _oui_oed.format.OpenSSL });
         *     var plaintext = _oui_oed.lib.PasswordBasedCipher.decrypt(_oui_oed.algo.AES, ciphertextParams, 'password', { format: _oui_oed.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
        }
    });
}());
;
/**
 * Cipher Feedback block mode.
 */
_oui_oed.mode.CFB = (function () {
    var CFB = _oui_oed.lib.BlockCipherMode.extend();

    CFB.Encryptor = CFB.extend({
        processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

            // Remember this block to use with next block
            this._prevBlock = words.slice(offset, offset + blockSize);
        }
    });

    CFB.Decryptor = CFB.extend({
        processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            // Remember this block to use with next block
            var thisBlock = words.slice(offset, offset + blockSize);

            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

            // This block becomes the previous block
            this._prevBlock = thisBlock;
        }
    });

    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
        // Shortcut
        var iv = this._iv;

        // Generate keystream
        if (iv) {
            var keystream = iv.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
        } else {
            var keystream = this._prevBlock;
        }
        cipher.encryptBlock(keystream, 0);

        // Encrypt
        for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
        }
    }

    return CFB;
}());
;
/**
 * Counter block mode.
 */
_oui_oed.mode.CTR = (function () {
    var CTR = _oui_oed.lib.BlockCipherMode.extend();

    var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
                counter = this._counter = iv.slice(0);

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);

            // Increment counter
            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
            }
        }
    });

    CTR.Decryptor = Encryptor;

    return CTR;
}());
;
/**
 * Output Feedback block mode.
 */
_oui_oed.mode.OFB = (function () {
    var OFB = _oui_oed.lib.BlockCipherMode.extend();

    var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;

            // Generate keystream
            if (iv) {
                keystream = this._keystream = iv.slice(0);

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            cipher.encryptBlock(keystream, 0);

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
            }
        }
    });

    OFB.Decryptor = Encryptor;

    return OFB;
}());
;
/**
 * Electronic Codebook block mode.
 */
_oui_oed.mode.ECB = (function () {
    var ECB = _oui_oed.lib.BlockCipherMode.extend();

    ECB.Encryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset);
        }
    });

    return ECB;
}());
;
/**
 * ANSI X.923 padding strategy.
 */
_oui_oed.pad.AnsiX923 = {
    pad: function (data, blockSize) {
        // Shortcuts
        var dataSigBytes = data.sigBytes;
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

        // Compute last byte position
        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

        // Pad
        data.clamp();
        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
        data.sigBytes += nPaddingBytes;
    },

    unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
    }
};
;
/**
 * ISO 10126 padding strategy.
 */
_oui_oed.pad.Iso10126 = {
    pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

        // Pad
        data.concat(_oui_oed.lib.WordArray.random(nPaddingBytes - 1)).
             concat(_oui_oed.lib.WordArray.create([nPaddingBytes << 24], 1));
    },

    unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
    }
};
;
/**
 * Zero padding strategy.
 */
_oui_oed.pad.ZeroPadding = {
    pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Pad
        data.clamp();
        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
    },

    unpad: function (data) {
        // Shortcut
        var dataWords = data.words;

        // Unpad
        var i = data.sigBytes - 1;
        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
            i--;
        }
        data.sigBytes = i + 1;
    }
};
;
/**
 * ISO/IEC 9797-1 Padding Method 2.
 */
_oui_oed.pad.Iso97971 = {
    pad: function (data, blockSize) {
        // Add 0x80 byte
        data.concat(_oui_oed.lib.WordArray.create([0x80000000], 1));

        // Zero pad the rest
        _oui_oed.pad.ZeroPadding.pad(data, blockSize);
    },

    unpad: function (data) {
        // Remove zero padding
        _oui_oed.pad.ZeroPadding.unpad(data);

        // Remove one more byte -- the 0x80 byte
        data.sigBytes--;
    }
};
;
/**
 * A noop padding strategy.
 */
_oui_oed.pad.NoPadding = {
    pad: function () {
    },

    unpad: function () {
    }
};
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    /**
     * RC4 stream cipher algorithm.
     */
    var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;

            // Init sbox
            var S = this._S = [];
            for (var i = 0; i < 256; i++) {
                S[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                j = (j + S[i] + keyByte) % 256;

                // Swap
                var t = S[i];
                S[i] = S[j];
                S[j] = t;
            }

            // Counters
            this._i = this._j = 0;
        },

        _doProcessBlock: function (M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
        },

        keySize: 256/32,

        ivSize: 0
    });

    function generateKeystreamWord() {
        // Shortcuts
        var S = this._S;
        var i = this._i;
        var j = this._j;

        // Generate keystream word
        var keystreamWord = 0;
        for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;

            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
        }

        // Update counters
        this._i = i;
        this._j = j;

        return keystreamWord;
    }

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.RC4.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.RC4.decrypt(ciphertext, key, cfg);
     */
    C.RC4 = StreamCipher._createHelper(RC4);

    /**
     * Modified RC4 stream cipher algorithm.
     */
    var RC4Drop = C_algo.RC4Drop = RC4.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        cfg: RC4.cfg.extend({
            drop: 192
        }),

        _doReset: function () {
            RC4._doReset.call(this);

            // Drop
            for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
            }
        }
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.RC4Drop.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.RC4Drop.decrypt(ciphertext, key, cfg);
     */
    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    // Reusable objects
    var S  = [];
    var C_ = [];
    var G  = [];

    /**
     * Rabbit stream cipher algorithm
     */
    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
        _doReset: function () {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
            }

            // Generate initial state values
            var X = this._X = [
                K[0], (K[3] << 16) | (K[2] >>> 16),
                K[1], (K[0] << 16) | (K[3] >>> 16),
                K[2], (K[1] << 16) | (K[0] >>> 16),
                K[3], (K[2] << 16) | (K[1] >>> 16)
            ];

            // Generate initial counter values
            var C = this._C = [
                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
            ];

            // Carry bit
            this._b = 0;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
                nextState.call(this);
            }

            // Modify the counters
            for (var i = 0; i < 8; i++) {
                C[i] ^= X[(i + 4) & 7];
            }

            // IV setup
            if (iv) {
                // Shortcuts
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];

                // Generate four subvectors
                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

                // Modify counter values
                C[0] ^= i0;
                C[1] ^= i1;
                C[2] ^= i2;
                C[3] ^= i3;
                C[4] ^= i0;
                C[5] ^= i1;
                C[6] ^= i2;
                C[7] ^= i3;

                // Iterate the system four times
                for (var i = 0; i < 4; i++) {
                    nextState.call(this);
                }
            }
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var X = this._X;

            // Iterate the system
            nextState.call(this);

            // Generate four keystream words
            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

            for (var i = 0; i < 4; i++) {
                // Swap endian
                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

                // Encrypt
                M[offset + i] ^= S[i];
            }
        },

        blockSize: 128/32,

        ivSize: 64/32
    });

    function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C;

        // Save old counter values
        for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
        }

        // Calculate new counter values
        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

        // Calculate the g-values
        for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i];

            // Construct high and low argument for squaring
            var ga = gx & 0xffff;
            var gb = gx >>> 16;

            // Calculate high and low result of squaring
            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

            // High XOR low
            G[i] = gh ^ gl;
        }

        // Calculate new state values
        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
    }

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.Rabbit.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.Rabbit.decrypt(ciphertext, key, cfg);
     */
    C.Rabbit = StreamCipher._createHelper(Rabbit);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    // Reusable objects
    var S  = [];
    var C_ = [];
    var G  = [];

    /**
     * Rabbit stream cipher algorithm.
     *
     * This is a legacy version that neglected to convert the key to little-endian.
     * This error doesn't affect the cipher's security,
     * but it does affect its compatibility with other implementations.
     */
    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
        _doReset: function () {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv;

            // Generate initial state values
            var X = this._X = [
                K[0], (K[3] << 16) | (K[2] >>> 16),
                K[1], (K[0] << 16) | (K[3] >>> 16),
                K[2], (K[1] << 16) | (K[0] >>> 16),
                K[3], (K[2] << 16) | (K[1] >>> 16)
            ];

            // Generate initial counter values
            var C = this._C = [
                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
            ];

            // Carry bit
            this._b = 0;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
                nextState.call(this);
            }

            // Modify the counters
            for (var i = 0; i < 8; i++) {
                C[i] ^= X[(i + 4) & 7];
            }

            // IV setup
            if (iv) {
                // Shortcuts
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];

                // Generate four subvectors
                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

                // Modify counter values
                C[0] ^= i0;
                C[1] ^= i1;
                C[2] ^= i2;
                C[3] ^= i3;
                C[4] ^= i0;
                C[5] ^= i1;
                C[6] ^= i2;
                C[7] ^= i3;

                // Iterate the system four times
                for (var i = 0; i < 4; i++) {
                    nextState.call(this);
                }
            }
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var X = this._X;

            // Iterate the system
            nextState.call(this);

            // Generate four keystream words
            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

            for (var i = 0; i < 4; i++) {
                // Swap endian
                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

                // Encrypt
                M[offset + i] ^= S[i];
            }
        },

        blockSize: 128/32,

        ivSize: 64/32
    });

    function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C;

        // Save old counter values
        for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
        }

        // Calculate new counter values
        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

        // Calculate the g-values
        for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i];

            // Construct high and low argument for squaring
            var ga = gx & 0xffff;
            var gb = gx >>> 16;

            // Calculate high and low result of squaring
            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

            // High XOR low
            G[i] = gh ^ gl;
        }

        // Calculate new state values
        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
    }

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.RabbitLegacy.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.RabbitLegacy.decrypt(ciphertext, key, cfg);
     */
    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;

    // Lookup tables
    var SBOX = [];
    var INV_SBOX = [];
    var SUB_MIX_0 = [];
    var SUB_MIX_1 = [];
    var SUB_MIX_2 = [];
    var SUB_MIX_3 = [];
    var INV_SUB_MIX_0 = [];
    var INV_SUB_MIX_1 = [];
    var INV_SUB_MIX_2 = [];
    var INV_SUB_MIX_3 = [];

    // Compute lookup tables
    (function () {
        // Compute double table
        var d = [];
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                d[i] = i << 1;
            } else {
                d[i] = (i << 1) ^ 0x11b;
            }
        }

        // Walk GF(2^8)
        var x = 0;
        var xi = 0;
        for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;

            // Compute multiplication
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];

            // Compute sub bytes, mix columns tables
            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
            SUB_MIX_3[x] = t;

            // Compute inv sub bytes, inv mix columns tables
            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
            INV_SUB_MIX_3[sx] = t;

            // Compute next counter
            if (!x) {
                x = xi = 1;
            } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
            }
        }
    }());

    // Precomputed Rcon lookup
    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

    /**
     * AES block cipher algorithm.
     */
    var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function () {
            // Skip reset of nRounds has been set before and key did not change
            if (this._nRounds && this._keyPriorReset === this._key) {
                return;
            }

            // Shortcuts
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;

            // Compute number of rounds
            var nRounds = this._nRounds = keySize + 6;

            // Compute number of key schedule rows
            var ksRows = (nRounds + 1) * 4;

            // Compute key schedule
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                    keySchedule[ksRow] = keyWords[ksRow];
                } else {
                    var t = keySchedule[ksRow - 1];

                    if (!(ksRow % keySize)) {
                        // Rot word
                        t = (t << 8) | (t >>> 24);

                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                        // Mix Rcon
                        t ^= RCON[(ksRow / keySize) | 0] << 24;
                    } else if (keySize > 6 && ksRow % keySize == 4) {
                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                    }

                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
            }

            // Compute inv key schedule
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;

                if (invKsRow % 4) {
                    var t = keySchedule[ksRow];
                } else {
                    var t = keySchedule[ksRow - 4];
                }

                if (invKsRow < 4 || ksRow <= 4) {
                    invKeySchedule[invKsRow] = t;
                } else {
                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                }
            }
        },

        encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },

        decryptBlock: function (M, offset) {
            // Swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;

            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

            // Inv swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
        },

        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            // Shortcut
            var nRounds = this._nRounds;

            // Get input, add round key
            var s0 = M[offset]     ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];

            // Key schedule row counter
            var ksRow = 4;

            // Rounds
            for (var round = 1; round < nRounds; round++) {
                // Shift rows, sub bytes, mix columns, add round key
                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                // Update state
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
            }

            // Shift rows, sub bytes, add round key
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

            // Set output
            M[offset]     = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
        },

        keySize: 256/32
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.AES.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.AES.decrypt(ciphertext, key, cfg);
     */
    C.AES = BlockCipher._createHelper(AES);
}());
;
(function () {
    // Shortcuts
    var C = _oui_oed;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;

    // Permuted Choice 1 constants
    var PC1 = [
        57, 49, 41, 33, 25, 17, 9,  1,
        58, 50, 42, 34, 26, 18, 10, 2,
        59, 51, 43, 35, 27, 19, 11, 3,
        60, 52, 44, 36, 63, 55, 47, 39,
        31, 23, 15, 7,  62, 54, 46, 38,
        30, 22, 14, 6,  61, 53, 45, 37,
        29, 21, 13, 5,  28, 20, 12, 4
    ];

    // Permuted Choice 2 constants
    var PC2 = [
        14, 17, 11, 24, 1,  5,
        3,  28, 15, 6,  21, 10,
        23, 19, 12, 4,  26, 8,
        16, 7,  27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ];

    // Cumulative bit shift constants
    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

    // SBOXes and round permutation constants
    var SBOX_P = [
        {
            0x0: 0x808200,
            0x10000000: 0x8000,
            0x20000000: 0x808002,
            0x30000000: 0x2,
            0x40000000: 0x200,
            0x50000000: 0x808202,
            0x60000000: 0x800202,
            0x70000000: 0x800000,
            0x80000000: 0x202,
            0x90000000: 0x800200,
            0xa0000000: 0x8200,
            0xb0000000: 0x808000,
            0xc0000000: 0x8002,
            0xd0000000: 0x800002,
            0xe0000000: 0x0,
            0xf0000000: 0x8202,
            0x8000000: 0x0,
            0x18000000: 0x808202,
            0x28000000: 0x8202,
            0x38000000: 0x8000,
            0x48000000: 0x808200,
            0x58000000: 0x200,
            0x68000000: 0x808002,
            0x78000000: 0x2,
            0x88000000: 0x800200,
            0x98000000: 0x8200,
            0xa8000000: 0x808000,
            0xb8000000: 0x800202,
            0xc8000000: 0x800002,
            0xd8000000: 0x8002,
            0xe8000000: 0x202,
            0xf8000000: 0x800000,
            0x1: 0x8000,
            0x10000001: 0x2,
            0x20000001: 0x808200,
            0x30000001: 0x800000,
            0x40000001: 0x808002,
            0x50000001: 0x8200,
            0x60000001: 0x200,
            0x70000001: 0x800202,
            0x80000001: 0x808202,
            0x90000001: 0x808000,
            0xa0000001: 0x800002,
            0xb0000001: 0x8202,
            0xc0000001: 0x202,
            0xd0000001: 0x800200,
            0xe0000001: 0x8002,
            0xf0000001: 0x0,
            0x8000001: 0x808202,
            0x18000001: 0x808000,
            0x28000001: 0x800000,
            0x38000001: 0x200,
            0x48000001: 0x8000,
            0x58000001: 0x800002,
            0x68000001: 0x2,
            0x78000001: 0x8202,
            0x88000001: 0x8002,
            0x98000001: 0x800202,
            0xa8000001: 0x202,
            0xb8000001: 0x808200,
            0xc8000001: 0x800200,
            0xd8000001: 0x0,
            0xe8000001: 0x8200,
            0xf8000001: 0x808002
        },
        {
            0x0: 0x40084010,
            0x1000000: 0x4000,
            0x2000000: 0x80000,
            0x3000000: 0x40080010,
            0x4000000: 0x40000010,
            0x5000000: 0x40084000,
            0x6000000: 0x40004000,
            0x7000000: 0x10,
            0x8000000: 0x84000,
            0x9000000: 0x40004010,
            0xa000000: 0x40000000,
            0xb000000: 0x84010,
            0xc000000: 0x80010,
            0xd000000: 0x0,
            0xe000000: 0x4010,
            0xf000000: 0x40080000,
            0x800000: 0x40004000,
            0x1800000: 0x84010,
            0x2800000: 0x10,
            0x3800000: 0x40004010,
            0x4800000: 0x40084010,
            0x5800000: 0x40000000,
            0x6800000: 0x80000,
            0x7800000: 0x40080010,
            0x8800000: 0x80010,
            0x9800000: 0x0,
            0xa800000: 0x4000,
            0xb800000: 0x40080000,
            0xc800000: 0x40000010,
            0xd800000: 0x84000,
            0xe800000: 0x40084000,
            0xf800000: 0x4010,
            0x10000000: 0x0,
            0x11000000: 0x40080010,
            0x12000000: 0x40004010,
            0x13000000: 0x40084000,
            0x14000000: 0x40080000,
            0x15000000: 0x10,
            0x16000000: 0x84010,
            0x17000000: 0x4000,
            0x18000000: 0x4010,
            0x19000000: 0x80000,
            0x1a000000: 0x80010,
            0x1b000000: 0x40000010,
            0x1c000000: 0x84000,
            0x1d000000: 0x40004000,
            0x1e000000: 0x40000000,
            0x1f000000: 0x40084010,
            0x10800000: 0x84010,
            0x11800000: 0x80000,
            0x12800000: 0x40080000,
            0x13800000: 0x4000,
            0x14800000: 0x40004000,
            0x15800000: 0x40084010,
            0x16800000: 0x10,
            0x17800000: 0x40000000,
            0x18800000: 0x40084000,
            0x19800000: 0x40000010,
            0x1a800000: 0x40004010,
            0x1b800000: 0x80010,
            0x1c800000: 0x0,
            0x1d800000: 0x4010,
            0x1e800000: 0x40080010,
            0x1f800000: 0x84000
        },
        {
            0x0: 0x104,
            0x100000: 0x0,
            0x200000: 0x4000100,
            0x300000: 0x10104,
            0x400000: 0x10004,
            0x500000: 0x4000004,
            0x600000: 0x4010104,
            0x700000: 0x4010000,
            0x800000: 0x4000000,
            0x900000: 0x4010100,
            0xa00000: 0x10100,
            0xb00000: 0x4010004,
            0xc00000: 0x4000104,
            0xd00000: 0x10000,
            0xe00000: 0x4,
            0xf00000: 0x100,
            0x80000: 0x4010100,
            0x180000: 0x4010004,
            0x280000: 0x0,
            0x380000: 0x4000100,
            0x480000: 0x4000004,
            0x580000: 0x10000,
            0x680000: 0x10004,
            0x780000: 0x104,
            0x880000: 0x4,
            0x980000: 0x100,
            0xa80000: 0x4010000,
            0xb80000: 0x10104,
            0xc80000: 0x10100,
            0xd80000: 0x4000104,
            0xe80000: 0x4010104,
            0xf80000: 0x4000000,
            0x1000000: 0x4010100,
            0x1100000: 0x10004,
            0x1200000: 0x10000,
            0x1300000: 0x4000100,
            0x1400000: 0x100,
            0x1500000: 0x4010104,
            0x1600000: 0x4000004,
            0x1700000: 0x0,
            0x1800000: 0x4000104,
            0x1900000: 0x4000000,
            0x1a00000: 0x4,
            0x1b00000: 0x10100,
            0x1c00000: 0x4010000,
            0x1d00000: 0x104,
            0x1e00000: 0x10104,
            0x1f00000: 0x4010004,
            0x1080000: 0x4000000,
            0x1180000: 0x104,
            0x1280000: 0x4010100,
            0x1380000: 0x0,
            0x1480000: 0x10004,
            0x1580000: 0x4000100,
            0x1680000: 0x100,
            0x1780000: 0x4010004,
            0x1880000: 0x10000,
            0x1980000: 0x4010104,
            0x1a80000: 0x10104,
            0x1b80000: 0x4000004,
            0x1c80000: 0x4000104,
            0x1d80000: 0x4010000,
            0x1e80000: 0x4,
            0x1f80000: 0x10100
        },
        {
            0x0: 0x80401000,
            0x10000: 0x80001040,
            0x20000: 0x401040,
            0x30000: 0x80400000,
            0x40000: 0x0,
            0x50000: 0x401000,
            0x60000: 0x80000040,
            0x70000: 0x400040,
            0x80000: 0x80000000,
            0x90000: 0x400000,
            0xa0000: 0x40,
            0xb0000: 0x80001000,
            0xc0000: 0x80400040,
            0xd0000: 0x1040,
            0xe0000: 0x1000,
            0xf0000: 0x80401040,
            0x8000: 0x80001040,
            0x18000: 0x40,
            0x28000: 0x80400040,
            0x38000: 0x80001000,
            0x48000: 0x401000,
            0x58000: 0x80401040,
            0x68000: 0x0,
            0x78000: 0x80400000,
            0x88000: 0x1000,
            0x98000: 0x80401000,
            0xa8000: 0x400000,
            0xb8000: 0x1040,
            0xc8000: 0x80000000,
            0xd8000: 0x400040,
            0xe8000: 0x401040,
            0xf8000: 0x80000040,
            0x100000: 0x400040,
            0x110000: 0x401000,
            0x120000: 0x80000040,
            0x130000: 0x0,
            0x140000: 0x1040,
            0x150000: 0x80400040,
            0x160000: 0x80401000,
            0x170000: 0x80001040,
            0x180000: 0x80401040,
            0x190000: 0x80000000,
            0x1a0000: 0x80400000,
            0x1b0000: 0x401040,
            0x1c0000: 0x80001000,
            0x1d0000: 0x400000,
            0x1e0000: 0x40,
            0x1f0000: 0x1000,
            0x108000: 0x80400000,
            0x118000: 0x80401040,
            0x128000: 0x0,
            0x138000: 0x401000,
            0x148000: 0x400040,
            0x158000: 0x80000000,
            0x168000: 0x80001040,
            0x178000: 0x40,
            0x188000: 0x80000040,
            0x198000: 0x1000,
            0x1a8000: 0x80001000,
            0x1b8000: 0x80400040,
            0x1c8000: 0x1040,
            0x1d8000: 0x80401000,
            0x1e8000: 0x400000,
            0x1f8000: 0x401040
        },
        {
            0x0: 0x80,
            0x1000: 0x1040000,
            0x2000: 0x40000,
            0x3000: 0x20000000,
            0x4000: 0x20040080,
            0x5000: 0x1000080,
            0x6000: 0x21000080,
            0x7000: 0x40080,
            0x8000: 0x1000000,
            0x9000: 0x20040000,
            0xa000: 0x20000080,
            0xb000: 0x21040080,
            0xc000: 0x21040000,
            0xd000: 0x0,
            0xe000: 0x1040080,
            0xf000: 0x21000000,
            0x800: 0x1040080,
            0x1800: 0x21000080,
            0x2800: 0x80,
            0x3800: 0x1040000,
            0x4800: 0x40000,
            0x5800: 0x20040080,
            0x6800: 0x21040000,
            0x7800: 0x20000000,
            0x8800: 0x20040000,
            0x9800: 0x0,
            0xa800: 0x21040080,
            0xb800: 0x1000080,
            0xc800: 0x20000080,
            0xd800: 0x21000000,
            0xe800: 0x1000000,
            0xf800: 0x40080,
            0x10000: 0x40000,
            0x11000: 0x80,
            0x12000: 0x20000000,
            0x13000: 0x21000080,
            0x14000: 0x1000080,
            0x15000: 0x21040000,
            0x16000: 0x20040080,
            0x17000: 0x1000000,
            0x18000: 0x21040080,
            0x19000: 0x21000000,
            0x1a000: 0x1040000,
            0x1b000: 0x20040000,
            0x1c000: 0x40080,
            0x1d000: 0x20000080,
            0x1e000: 0x0,
            0x1f000: 0x1040080,
            0x10800: 0x21000080,
            0x11800: 0x1000000,
            0x12800: 0x1040000,
            0x13800: 0x20040080,
            0x14800: 0x20000000,
            0x15800: 0x1040080,
            0x16800: 0x80,
            0x17800: 0x21040000,
            0x18800: 0x40080,
            0x19800: 0x21040080,
            0x1a800: 0x0,
            0x1b800: 0x21000000,
            0x1c800: 0x1000080,
            0x1d800: 0x40000,
            0x1e800: 0x20040000,
            0x1f800: 0x20000080
        },
        {
            0x0: 0x10000008,
            0x100: 0x2000,
            0x200: 0x10200000,
            0x300: 0x10202008,
            0x400: 0x10002000,
            0x500: 0x200000,
            0x600: 0x200008,
            0x700: 0x10000000,
            0x800: 0x0,
            0x900: 0x10002008,
            0xa00: 0x202000,
            0xb00: 0x8,
            0xc00: 0x10200008,
            0xd00: 0x202008,
            0xe00: 0x2008,
            0xf00: 0x10202000,
            0x80: 0x10200000,
            0x180: 0x10202008,
            0x280: 0x8,
            0x380: 0x200000,
            0x480: 0x202008,
            0x580: 0x10000008,
            0x680: 0x10002000,
            0x780: 0x2008,
            0x880: 0x200008,
            0x980: 0x2000,
            0xa80: 0x10002008,
            0xb80: 0x10200008,
            0xc80: 0x0,
            0xd80: 0x10202000,
            0xe80: 0x202000,
            0xf80: 0x10000000,
            0x1000: 0x10002000,
            0x1100: 0x10200008,
            0x1200: 0x10202008,
            0x1300: 0x2008,
            0x1400: 0x200000,
            0x1500: 0x10000000,
            0x1600: 0x10000008,
            0x1700: 0x202000,
            0x1800: 0x202008,
            0x1900: 0x0,
            0x1a00: 0x8,
            0x1b00: 0x10200000,
            0x1c00: 0x2000,
            0x1d00: 0x10002008,
            0x1e00: 0x10202000,
            0x1f00: 0x200008,
            0x1080: 0x8,
            0x1180: 0x202000,
            0x1280: 0x200000,
            0x1380: 0x10000008,
            0x1480: 0x10002000,
            0x1580: 0x2008,
            0x1680: 0x10202008,
            0x1780: 0x10200000,
            0x1880: 0x10202000,
            0x1980: 0x10200008,
            0x1a80: 0x2000,
            0x1b80: 0x202008,
            0x1c80: 0x200008,
            0x1d80: 0x0,
            0x1e80: 0x10000000,
            0x1f80: 0x10002008
        },
        {
            0x0: 0x100000,
            0x10: 0x2000401,
            0x20: 0x400,
            0x30: 0x100401,
            0x40: 0x2100401,
            0x50: 0x0,
            0x60: 0x1,
            0x70: 0x2100001,
            0x80: 0x2000400,
            0x90: 0x100001,
            0xa0: 0x2000001,
            0xb0: 0x2100400,
            0xc0: 0x2100000,
            0xd0: 0x401,
            0xe0: 0x100400,
            0xf0: 0x2000000,
            0x8: 0x2100001,
            0x18: 0x0,
            0x28: 0x2000401,
            0x38: 0x2100400,
            0x48: 0x100000,
            0x58: 0x2000001,
            0x68: 0x2000000,
            0x78: 0x401,
            0x88: 0x100401,
            0x98: 0x2000400,
            0xa8: 0x2100000,
            0xb8: 0x100001,
            0xc8: 0x400,
            0xd8: 0x2100401,
            0xe8: 0x1,
            0xf8: 0x100400,
            0x100: 0x2000000,
            0x110: 0x100000,
            0x120: 0x2000401,
            0x130: 0x2100001,
            0x140: 0x100001,
            0x150: 0x2000400,
            0x160: 0x2100400,
            0x170: 0x100401,
            0x180: 0x401,
            0x190: 0x2100401,
            0x1a0: 0x100400,
            0x1b0: 0x1,
            0x1c0: 0x0,
            0x1d0: 0x2100000,
            0x1e0: 0x2000001,
            0x1f0: 0x400,
            0x108: 0x100400,
            0x118: 0x2000401,
            0x128: 0x2100001,
            0x138: 0x1,
            0x148: 0x2000000,
            0x158: 0x100000,
            0x168: 0x401,
            0x178: 0x2100400,
            0x188: 0x2000001,
            0x198: 0x2100000,
            0x1a8: 0x0,
            0x1b8: 0x2100401,
            0x1c8: 0x100401,
            0x1d8: 0x400,
            0x1e8: 0x2000400,
            0x1f8: 0x100001
        },
        {
            0x0: 0x8000820,
            0x1: 0x20000,
            0x2: 0x8000000,
            0x3: 0x20,
            0x4: 0x20020,
            0x5: 0x8020820,
            0x6: 0x8020800,
            0x7: 0x800,
            0x8: 0x8020000,
            0x9: 0x8000800,
            0xa: 0x20800,
            0xb: 0x8020020,
            0xc: 0x820,
            0xd: 0x0,
            0xe: 0x8000020,
            0xf: 0x20820,
            0x80000000: 0x800,
            0x80000001: 0x8020820,
            0x80000002: 0x8000820,
            0x80000003: 0x8000000,
            0x80000004: 0x8020000,
            0x80000005: 0x20800,
            0x80000006: 0x20820,
            0x80000007: 0x20,
            0x80000008: 0x8000020,
            0x80000009: 0x820,
            0x8000000a: 0x20020,
            0x8000000b: 0x8020800,
            0x8000000c: 0x0,
            0x8000000d: 0x8020020,
            0x8000000e: 0x8000800,
            0x8000000f: 0x20000,
            0x10: 0x20820,
            0x11: 0x8020800,
            0x12: 0x20,
            0x13: 0x800,
            0x14: 0x8000800,
            0x15: 0x8000020,
            0x16: 0x8020020,
            0x17: 0x20000,
            0x18: 0x0,
            0x19: 0x20020,
            0x1a: 0x8020000,
            0x1b: 0x8000820,
            0x1c: 0x8020820,
            0x1d: 0x20800,
            0x1e: 0x820,
            0x1f: 0x8000000,
            0x80000010: 0x20000,
            0x80000011: 0x800,
            0x80000012: 0x8020020,
            0x80000013: 0x20820,
            0x80000014: 0x20,
            0x80000015: 0x8020000,
            0x80000016: 0x8000000,
            0x80000017: 0x8000820,
            0x80000018: 0x8020820,
            0x80000019: 0x8000020,
            0x8000001a: 0x8000800,
            0x8000001b: 0x0,
            0x8000001c: 0x20800,
            0x8000001d: 0x820,
            0x8000001e: 0x20020,
            0x8000001f: 0x8020800
        }
    ];

    // Masks that select the SBOX input
    var SBOX_MASK = [
        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
    ];

    /**
     * DES block cipher algorithm.
     */
    var DES = C_algo.DES = BlockCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;

            // Select 56 bits according to PC1
            var keyBits = [];
            for (var i = 0; i < 56; i++) {
                var keyBitPos = PC1[i] - 1;
                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
            }

            // Assemble 16 subkeys
            var subKeys = this._subKeys = [];
            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                // Create subkey
                var subKey = subKeys[nSubKey] = [];

                // Shortcut
                var bitShift = BIT_SHIFTS[nSubKey];

                // Select 48 bits according to PC2
                for (var i = 0; i < 24; i++) {
                    // Select from the left 28 key bits
                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

                    // Select from the right 28 key bits
                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
                }

                // Since each subkey is applied to an expanded 32-bit input,
                // the subkey can be broken into 8 values scaled to 32-bits,
                // which allows the key to be used without expansion
                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
                for (var i = 1; i < 7; i++) {
                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
                }
                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
            }

            // Compute inverse subkeys
            var invSubKeys = this._invSubKeys = [];
            for (var i = 0; i < 16; i++) {
                invSubKeys[i] = subKeys[15 - i];
            }
        },

        encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._subKeys);
        },

        decryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._invSubKeys);
        },

        _doCryptBlock: function (M, offset, subKeys) {
            // Get input
            this._lBlock = M[offset];
            this._rBlock = M[offset + 1];

            // Initial permutation
            exchangeLR.call(this, 4,  0x0f0f0f0f);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeRL.call(this, 2,  0x33333333);
            exchangeRL.call(this, 8,  0x00ff00ff);
            exchangeLR.call(this, 1,  0x55555555);

            // Rounds
            for (var round = 0; round < 16; round++) {
                // Shortcuts
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock;

                // Feistel function
                var f = 0;
                for (var i = 0; i < 8; i++) {
                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f;
            }

            // Undo swap from last round
            var t = this._lBlock;
            this._lBlock = this._rBlock;
            this._rBlock = t;

            // Final permutation
            exchangeLR.call(this, 1,  0x55555555);
            exchangeRL.call(this, 8,  0x00ff00ff);
            exchangeRL.call(this, 2,  0x33333333);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeLR.call(this, 4,  0x0f0f0f0f);

            // Set output
            M[offset] = this._lBlock;
            M[offset + 1] = this._rBlock;
        },

        keySize: 64/32,

        ivSize: 64/32,

        blockSize: 64/32
    });

    // Swap bits across the left and right words
    function exchangeLR(offset, mask) {
        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
        this._rBlock ^= t;
        this._lBlock ^= t << offset;
    }

    function exchangeRL(offset, mask) {
        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
        this._lBlock ^= t;
        this._rBlock ^= t << offset;
    }

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.DES.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.DES.decrypt(ciphertext, key, cfg);
     */
    C.DES = BlockCipher._createHelper(DES);

    /**
     * Triple-DES block cipher algorithm.
     */
    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;

            // Create DES instances
            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
        },

        encryptBlock: function (M, offset) {
            this._des1.encryptBlock(M, offset);
            this._des2.decryptBlock(M, offset);
            this._des3.encryptBlock(M, offset);
        },

        decryptBlock: function (M, offset) {
            this._des3.decryptBlock(M, offset);
            this._des2.encryptBlock(M, offset);
            this._des1.decryptBlock(M, offset);
        },

        keySize: 192/32,

        ivSize: 64/32,

        blockSize: 64/32
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = _oui_oed.TripleDES.encrypt(message, key, cfg);
     *     var plaintext  = _oui_oed.TripleDES.decrypt(ciphertext, key, cfg);
     */
    C.TripleDES = BlockCipher._createHelper(TripleDES);
}());
;
//加密解密开始
oui.encode4des = function(message,key){
    var keyHex = _oui_oed.enc.Utf8.parse(key);
    var enCfg= {};
    enCfg.mode = _oui_oed.mode.ECB;
    enCfg.padding = _oui_oed.pad.Pkcs7;
    var encrypted = _oui_oed.DES.encrypt(message, keyHex, enCfg);
    return encrypted.ciphertext.toString();
};
oui.decode4des = function(message,key){
    var keyHex = _oui_oed.enc.Utf8.parse(key);
    var deTextCfg = {};
    deTextCfg.ciphertext = _oui_oed.enc.Hex.parse(message);
    var deCfg = {};
    deCfg.mode =  _oui_oed.mode.ECB;
    deCfg.padding = _oui_oed.pad.Pkcs7;
    var decrypted = _oui_oed.DES.decrypt(deTextCfg , keyHex, deCfg);
    return decrypted.toString(_oui_oed.enc.Utf8);
};;
(function(win){var oui = win.oui ||{};win.oui=oui;oui.BD = {};/** @license Copyright (c) 2012 Daniel Trebbien and other contributors
Portions Copyright (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany
Portions Copyright (c) 1995-2001 International Business Machines Corporation and others

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, provided that the above copyright notice(s) and this permission notice appear in all copies of the Software and that both the above copyright notice(s) and this permission notice appear in supporting documentation.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization of the copyright holder.
*/
(function () {

var _oui_bd_ = (function () {
/* Generated from '_oui_bd_.nrx' 8 Sep 2000 11:07:48 [v2.00] */
/* Options: Binary Comments Crossref Format Java Logo Strictargs Strictcase Trace2 Verbose3 */
//--package com.ibm.icu.math;

/* ------------------------------------------------------------------ */
/* _oui_bd_ -- Math context settings                               */
/* ------------------------------------------------------------------ */
/* Copyright IBM Corporation, 1997, 2000.  All Rights Reserved.       */
/*                                                                    */
/*   The _oui_bd_ object encapsulates the settings used by the     */
/*   _oui_bd class; it could also be used by other arithmetics.    */
/* ------------------------------------------------------------------ */
/* Notes:                                                             */
/*                                                                    */
/* 1. The properties are checked for validity on construction, so     */
/*    the _oui_bd class may assume that they are correct.          */
/* ------------------------------------------------------------------ */
/* Author:    Mike Cowlishaw                                          */
/* 1997.09.03 Initial version (edited from netrexx.lang.RexxSet)      */
/* 1997.09.12 Add lostDigits property                                 */
/* 1998.05.02 Make the class immutable and final; drop set methods    */
/* 1998.06.05 Add Round (rounding modes) property                     */
/* 1998.06.25 Rename from DecimalContext; allow digits=0              */
/* 1998.10.12 change to com.ibm.icu.math package                          */
/* 1999.02.06 add javadoc comments                                    */
/* 1999.03.05 simplify; changes from discussion with J. Bloch         */
/* 1999.03.13 1.00 release to IBM Centre for Java Technology          */
/* 1999.07.10 1.04 flag serialization unused                          */
/* 2000.01.01 1.06 copyright update                                   */
/* ------------------------------------------------------------------ */


/* JavaScript conversion (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany */



/**
 * The <code>_oui_bd_</code> immutable class encapsulates the
 * settings understood by the operator methods of the {@link _oui_bd}
 * class (and potentially other classes).  Operator methods are those
 * that effect an operation on a number or a pair of numbers.
 * <p>
 * The settings, which are not base-dependent, comprise:
 * <ol>
 * <li><code>digits</code>:
 * the number of digits (precision) to be used for an operation
 * <li><code>form</code>:
 * the form of any exponent that results from the operation
 * <li><code>lostDigits</code>:
 * whether checking for lost digits is enabled
 * <li><code>roundingMode</code>:
 * the algorithm to be used for rounding.
 * </ol>
 * <p>
 * When provided, a <code>_oui_bd_</code> object supplies the
 * settings for an operation directly.
 * <p>
 * When <code>_oui_bd_.DEFAULT</code> is provided for a
 * <code>_oui_bd_</code> parameter then the default settings are used
 * (<code>9, SCIENTIFIC, false, ROUND_HALF_UP</code>).
 * <p>
 * In the <code>_oui_bd</code> class, all methods which accept a
 * <code>_oui_bd_</code> object defaults) also have a version of the
 * method which does not accept a _oui_bd_ parameter.  These versions
 * carry out unlimited precision fixed point arithmetic (as though the
 * settings were (<code>0, PLAIN, false, ROUND_HALF_UP</code>).
 * <p>
 * The instance variables are shared with default access (so they are
 * directly accessible to the <code>_oui_bd</code> class), but must
 * never be changed.
 * <p>
 * The rounding mode constants have the same names and values as the
 * constants of the same name in <code>java.math._oui_bd</code>, to
 * maintain compatibility with earlier versions of
 * <code>_oui_bd</code>.
 *
 * @see     _oui_bd
 * @author  Mike Cowlishaw
 * @stable ICU 2.0
 */

//--public final class _oui_bd_ implements java.io.Serializable{
 //--private static final java.lang.String $0="_oui_bd_.nrx";

 //-- methods
 _oui_bd_.prototype.getDigits = getDigits;
 _oui_bd_.prototype.getForm = getForm;
 _oui_bd_.prototype.getLostDigits = getLostDigits;
 _oui_bd_.prototype.getRoundingMode = getRoundingMode;
 _oui_bd_.prototype.toString = toString;
 _oui_bd_.prototype.isValidRound = isValidRound;


 /* ----- Properties ----- */
 /* properties public constant */
 /**
  * Plain (fixed point) notation, without any exponent.
  * Used as a setting to control the form of the result of a
  * <code>_oui_bd</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #ENGINEERING
  * @see #SCIENTIFIC
  * @stable ICU 2.0
  */
 //--public static final int PLAIN=0; // [no exponent]
 _oui_bd_.PLAIN = _oui_bd_.prototype.PLAIN = 0; // [no exponent]

 /**
  * Standard floating point notation (with scientific exponential
  * format, where there is one digit before any decimal point).
  * Used as a setting to control the form of the result of a
  * <code>_oui_bd</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #ENGINEERING
  * @see #PLAIN
  * @stable ICU 2.0
  */
 //--public static final int SCIENTIFIC=1; // 1 digit before .
 _oui_bd_.SCIENTIFIC = _oui_bd_.prototype.SCIENTIFIC = 1; // 1 digit before .

 /**
  * Standard floating point notation (with engineering exponential
  * format, where the power of ten is a multiple of 3).
  * Used as a setting to control the form of the result of a
  * <code>_oui_bd</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #PLAIN
  * @see #SCIENTIFIC
  * @stable ICU 2.0
  */
 //--public static final int ENGINEERING=2; // 1-3 digits before .
 _oui_bd_.ENGINEERING = _oui_bd_.prototype.ENGINEERING = 2; // 1-3 digits before .

 // The rounding modes match the original _oui_bd class values
 /**
  * Rounding mode to round to a more positive number.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result
  * should be rounded towards the next more positive digit.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_CEILING=2;
 _oui_bd_.ROUND_CEILING = _oui_bd_.prototype.ROUND_CEILING = 2;

 /**
  * Rounding mode to round towards zero.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * All discarded digits are ignored (truncated).  The result is
  * neither incremented nor decremented.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_DOWN=1;
 _oui_bd_.ROUND_DOWN = _oui_bd_.prototype.ROUND_DOWN = 1;

 /**
  * Rounding mode to round to a more negative number.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result
  * should be rounded towards the next more negative digit.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_FLOOR=3;
 _oui_bd_.ROUND_FLOOR = _oui_bd_.prototype.ROUND_FLOOR = 3;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded down.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If the discarded digits represent greater than half (0.5 times)
  * the value of a one in the next position then the result should be
  * rounded up (away from zero).  Otherwise the discarded digits are
  * ignored.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_DOWN=5;
 _oui_bd_.ROUND_HALF_DOWN = _oui_bd_.prototype.ROUND_HALF_DOWN = 5;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded to the nearest even neighbor.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If the discarded digits represent greater than half (0.5 times)
  * the value of a one in the next position then the result should be
  * rounded up (away from zero).  If they represent less than half,
  * then the result should be rounded down.
  * <p>
  * Otherwise (they represent exactly half) the result is rounded
  * down if its rightmost digit is even, or rounded up if its
  * rightmost digit is odd (to make an even digit).
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_EVEN=6;
 _oui_bd_.ROUND_HALF_EVEN = _oui_bd_.prototype.ROUND_HALF_EVEN = 6;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded up.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If the discarded digits represent greater than or equal to half
  * (0.5 times) the value of a one in the next position then the result
  * should be rounded up (away from zero).  Otherwise the discarded
  * digits are ignored.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_UP=4;
 _oui_bd_.ROUND_HALF_UP = _oui_bd_.prototype.ROUND_HALF_UP = 4;

 /**
  * Rounding mode to assert that no rounding is necessary.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * Rounding (potential loss of information) is not permitted.
  * If any of the discarded digits are non-zero then an
  * <code>ArithmeticException</code> should be thrown.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UNNECESSARY=7;
 _oui_bd_.ROUND_UNNECESSARY = _oui_bd_.prototype.ROUND_UNNECESSARY = 7;

 /**
  * Rounding mode to round away from zero.
  * Used as a setting to control the rounding mode used during a
  * <code>_oui_bd</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result will
  * be rounded up (away from zero).
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UP=0;
 _oui_bd_.ROUND_UP = _oui_bd_.prototype.ROUND_UP = 0;


 /* properties shared */
 /**
  * The number of digits (precision) to be used for an operation.
  * A value of 0 indicates that unlimited precision (as many digits
  * as are required) will be used.
  * <p>
  * The {@link _oui_bd} operator methods use this value to
  * determine the precision of results.
  * Note that leading zeros (in the integer part of a number) are
  * never significant.
  * <p>
  * <code>digits</code> will always be non-negative.
  *
  * @serial
  */
 //--int digits;

 /**
  * The form of results from an operation.
  * <p>
  * The {@link _oui_bd} operator methods use this value to
  * determine the form of results, in particular whether and how
  * exponential notation should be used.
  *
  * @see #ENGINEERING
  * @see #PLAIN
  * @see #SCIENTIFIC
  * @serial
  */
 //--int form; // values for this must fit in a byte

 /**
  * Controls whether lost digits checking is enabled for an
  * operation.
  * Set to <code>true</code> to enable checking, or
  * to <code>false</code> to disable checking.
  * <p>
  * When enabled, the {@link _oui_bd} operator methods check
  * the precision of their operand or operands, and throw an
  * <code>ArithmeticException</code> if an operand is more precise
  * than the digits setting (that is, digits would be lost).
  * When disabled, operands are rounded to the specified digits.
  *
  * @serial
  */
 //--boolean lostDigits;

 /**
  * The rounding algorithm to be used for an operation.
  * <p>
  * The {@link _oui_bd} operator methods use this value to
  * determine the algorithm to be used when non-zero digits have to
  * be discarded in order to reduce the precision of a result.
  * The value must be one of the public constants whose name starts
  * with <code>ROUND_</code>.
  *
  * @see #ROUND_CEILING
  * @see #ROUND_DOWN
  * @see #ROUND_FLOOR
  * @see #ROUND_HALF_DOWN
  * @see #ROUND_HALF_EVEN
  * @see #ROUND_HALF_UP
  * @see #ROUND_UNNECESSARY
  * @see #ROUND_UP
  * @serial
  */
 //--int roundingMode;

 /* properties private constant */
 // default settings
 //--private static final int DEFAULT_FORM=SCIENTIFIC;
 //--private static final int DEFAULT_DIGITS=9;
 //--private static final boolean DEFAULT_LOSTDIGITS=false;
 //--private static final int DEFAULT_ROUNDINGMODE=ROUND_HALF_UP;
 _oui_bd_.prototype.DEFAULT_FORM=_oui_bd_.prototype.SCIENTIFIC;
 _oui_bd_.prototype.DEFAULT_DIGITS=9;
 _oui_bd_.prototype.DEFAULT_LOSTDIGITS=false;
 _oui_bd_.prototype.DEFAULT_ROUNDINGMODE=_oui_bd_.prototype.ROUND_HALF_UP;

 /* properties private constant */

 //--private static final int MIN_DIGITS=0; // smallest value for DIGITS.
 //--private static final int MAX_DIGITS=999999999; // largest value for DIGITS.  If increased,
 _oui_bd_.prototype.MIN_DIGITS=0; // smallest value for DIGITS.
 _oui_bd_.prototype.MAX_DIGITS=999999999; // largest value for DIGITS.  If increased,
 // the _oui_bd class may need update.
 // list of valid rounding mode values, most common two first
 //--private static final int ROUNDS[]=new int[]{ROUND_HALF_UP,ROUND_UNNECESSARY,ROUND_CEILING,ROUND_DOWN,ROUND_FLOOR,ROUND_HALF_DOWN,ROUND_HALF_EVEN,ROUND_UP};
 _oui_bd_.prototype.ROUNDS=new Array(_oui_bd_.prototype.ROUND_HALF_UP,_oui_bd_.prototype.ROUND_UNNECESSARY,_oui_bd_.prototype.ROUND_CEILING,_oui_bd_.prototype.ROUND_DOWN,_oui_bd_.prototype.ROUND_FLOOR,_oui_bd_.prototype.ROUND_HALF_DOWN,_oui_bd_.prototype.ROUND_HALF_EVEN,_oui_bd_.prototype.ROUND_UP);


 //--private static final java.lang.String ROUNDWORDS[]=new java.lang.String[]{"ROUND_HALF_UP","ROUND_UNNECESSARY","ROUND_CEILING","ROUND_DOWN","ROUND_FLOOR","ROUND_HALF_DOWN","ROUND_HALF_EVEN","ROUND_UP"}; // matching names of the ROUNDS values
 _oui_bd_.prototype.ROUNDWORDS=new Array("ROUND_HALF_UP","ROUND_UNNECESSARY","ROUND_CEILING","ROUND_DOWN","ROUND_FLOOR","ROUND_HALF_DOWN","ROUND_HALF_EVEN","ROUND_UP"); // matching names of the ROUNDS values




 /* properties private constant unused */

 // Serialization version
 //--private static final long serialVersionUID=7163376998892515376L;

 /* properties public constant */
 /**
  * A <code>_oui_bd_</code> object initialized to the default
  * settings for general-purpose arithmetic.  That is,
  * <code>digits=9 form=SCIENTIFIC lostDigits=false
  * roundingMode=ROUND_HALF_UP</code>.
  *
  * @see #SCIENTIFIC
  * @see #ROUND_HALF_UP
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math._oui_bd_ DEFAULT=new com.ibm.icu.math._oui_bd_(DEFAULT_DIGITS,DEFAULT_FORM,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 _oui_bd_.prototype.DEFAULT=new _oui_bd_(_oui_bd_.prototype.DEFAULT_DIGITS,_oui_bd_.prototype.DEFAULT_FORM,_oui_bd_.prototype.DEFAULT_LOSTDIGITS,_oui_bd_.prototype.DEFAULT_ROUNDINGMODE);




 /* ----- Constructors ----- */

 /**
  * Constructs a new <code>_oui_bd_</code> with a specified
  * precision.
  * The other settings are set to the default values
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999).
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>_oui_bd_</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public _oui_bd_(int setdigits){
 //-- this(setdigits,DEFAULT_FORM,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 //-- return;}


 /**
  * Constructs a new <code>_oui_bd_</code> with a specified
  * precision and form.
  * The other settings are set to the default values
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> parameter is not one of the appropriate
  * constants.
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>_oui_bd_</code>.
  * @param setform       The <code>int</code> form setting
  *                      for this <code>_oui_bd_</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public _oui_bd_(int setdigits,int setform){
 //-- this(setdigits,setform,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 //-- return;}

 /**
  * Constructs a new <code>_oui_bd_</code> with a specified
  * precision, form, and lostDigits setting.
  * The roundingMode setting is set to its default value
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> parameter is not one of the appropriate
  * constants.
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>_oui_bd_</code>.
  * @param setform       The <code>int</code> form setting
  *                      for this <code>_oui_bd_</code>.
  * @param setlostdigits The <code>boolean</code> lostDigits
  *                      setting for this <code>_oui_bd_</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public _oui_bd_(int setdigits,int setform,boolean setlostdigits){
 //-- this(setdigits,setform,setlostdigits,DEFAULT_ROUNDINGMODE);
 //-- return;}

 /**
  * Constructs a new <code>_oui_bd_</code> with a specified
  * precision, form, lostDigits, and roundingMode setting.
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> or <code>setroundingmode</code> parameters is
  * not one of the appropriate constants.
  *
  * @param setdigits       The <code>int</code> digits setting
  *                        for this <code>_oui_bd_</code>.
  * @param setform         The <code>int</code> form setting
  *                        for this <code>_oui_bd_</code>.
  * @param setlostdigits   The <code>boolean</code> lostDigits
  *                        setting for this <code>_oui_bd_</code>.
  * @param setroundingmode The <code>int</code> roundingMode setting
  *                        for this <code>_oui_bd_</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public _oui_bd_(int setdigits,int setform,boolean setlostdigits,int setroundingmode){super();
 function _oui_bd_() {
  //-- members
  this.digits = 0;
  this.form = 0; // values for this must fit in a byte
  this.lostDigits = false;
  this.roundingMode = 0;

  //-- overloaded ctor
  var setform = this.DEFAULT_FORM;
  var setlostdigits = this.DEFAULT_LOSTDIGITS;
  var setroundingmode = this.DEFAULT_ROUNDINGMODE;
  if (_oui_bd_.arguments.length == 4)
   {
    setform = _oui_bd_.arguments[1];
    setlostdigits = _oui_bd_.arguments[2];
    setroundingmode = _oui_bd_.arguments[3];
   }
  else if (_oui_bd_.arguments.length == 3)
   {
    setform = _oui_bd_.arguments[1];
    setlostdigits = _oui_bd_.arguments[2];
   }
  else if (_oui_bd_.arguments.length == 2)
   {
    setform = _oui_bd_.arguments[1];
   }
  else if (_oui_bd_.arguments.length != 1)
   {
    throw "_oui_bd_(): " + _oui_bd_.arguments.length + " arguments given; expected 1 to 4";
   }
  var setdigits = _oui_bd_.arguments[0];


  // set values, after checking
  if (setdigits!=this.DEFAULT_DIGITS)
   {
    if (setdigits<this.MIN_DIGITS)
     throw "_oui_bd_(): Digits too small: "+setdigits;
    if (setdigits>this.MAX_DIGITS)
     throw "_oui_bd_(): Digits too large: "+setdigits;
   }
  {/*select*/
  if (setform==this.SCIENTIFIC)
   {} // [most common]
  else if (setform==this.ENGINEERING)
   {}
  else if (setform==this.PLAIN)
   {}
  else{
   throw "_oui_bd_() Bad form value: "+setform;
  }
  }
  if ((!(this.isValidRound(setroundingmode))))
   throw "_oui_bd_(): Bad roundingMode value: "+setroundingmode;
  this.digits=setdigits;
  this.form=setform;
  this.lostDigits=setlostdigits; // [no bad value possible]
  this.roundingMode=setroundingmode;
  return;}

 /**
  * Returns the digits setting.
  * This value is always non-negative.
  *
  * @return an <code>int</code> which is the value of the digits
  *         setting
  * @stable ICU 2.0
  */

 //--public int getDigits(){
 function getDigits() {
  return this.digits;
  }

 /**
  * Returns the form setting.
  * This will be one of
  * {@link #ENGINEERING},
  * {@link #PLAIN}, or
  * {@link #SCIENTIFIC}.
  *
  * @return an <code>int</code> which is the value of the form setting
  * @stable ICU 2.0
  */

 //--public int getForm(){
 function getForm() {
  return this.form;
  }

 /**
  * Returns the lostDigits setting.
  * This will be either <code>true</code> (enabled) or
  * <code>false</code> (disabled).
  *
  * @return a <code>boolean</code> which is the value of the lostDigits
  *           setting
  * @stable ICU 2.0
  */

 //--public boolean getLostDigits(){
 function getLostDigits() {
  return this.lostDigits;
  }

 /**
  * Returns the roundingMode setting.
  * This will be one of
  * {@link  #ROUND_CEILING},
  * {@link  #ROUND_DOWN},
  * {@link  #ROUND_FLOOR},
  * {@link  #ROUND_HALF_DOWN},
  * {@link  #ROUND_HALF_EVEN},
  * {@link  #ROUND_HALF_UP},
  * {@link  #ROUND_UNNECESSARY}, or
  * {@link  #ROUND_UP}.
  *
  * @return an <code>int</code> which is the value of the roundingMode
  *         setting
  * @stable ICU 2.0
  */

 //--public int getRoundingMode(){
 function getRoundingMode() {
  return this.roundingMode;
  }

 /** Returns the <code>_oui_bd_</code> as a readable string.
  * The <code>String</code> returned represents the settings of the
  * <code>_oui_bd_</code> object as four blank-delimited words
  * separated by a single blank and with no leading or trailing blanks,
  * as follows:
  * <ol>
  * <li>
  * <code>digits=</code>, immediately followed by
  * the value of the digits setting as a numeric word.
  * <li>
  * <code>form=</code>, immediately followed by
  * the value of the form setting as an uppercase word
  * (one of <code>SCIENTIFIC</code>, <code>PLAIN</code>, or
  * <code>ENGINEERING</code>).
  * <li>
  * <code>lostDigits=</code>, immediately followed by
  * the value of the lostDigits setting
  * (<code>1</code> if enabled, <code>0</code> if disabled).
  * <li>
  * <code>roundingMode=</code>, immediately followed by
  * the value of the roundingMode setting as a word.
  * This word will be the same as the name of the corresponding public
  * constant.
  * </ol>
  * <p>
  * For example:
  * <br><code>
  * digits=9 form=SCIENTIFIC lostDigits=0 roundingMode=ROUND_HALF_UP
  * </code>
  * <p>
  * Additional words may be appended to the result of
  * <code>toString</code> in the future if more properties are added
  * to the class.
  *
  * @return a <code>String</code> representing the context settings.
  * @stable ICU 2.0
  */

 //--public java.lang.String toString(){
 function toString() {
  //--java.lang.String formstr=null;
  var formstr=null;
  //--int r=0;
  var r=0;
  //--java.lang.String roundword=null;
  var roundword=null;
  {/*select*/
  if (this.form==this.SCIENTIFIC)
   formstr="SCIENTIFIC";
  else if (this.form==this.ENGINEERING)
   formstr="ENGINEERING";
  else{
   formstr="PLAIN";/* form=PLAIN */
  }
  }
  {var $1=this.ROUNDS.length;r=0;r:for(;$1>0;$1--,r++){
   if (this.roundingMode==this.ROUNDS[r])
    {
     roundword=this.ROUNDWORDS[r];
     break r;
    }
   }
  }/*r*/
  return "digits="+this.digits+" "+"form="+formstr+" "+"lostDigits="+(this.lostDigits?"1":"0")+" "+"roundingMode="+roundword;
  }


 /* <sgml> Test whether round is valid. </sgml> */
 // This could be made shared for use by _oui_bd for setScale.

 //--private static boolean isValidRound(int testround){
 function isValidRound(testround) {
  //--int r=0;
  var r=0;
  {var $2=this.ROUNDS.length;r=0;r:for(;$2>0;$2--,r++){
   if (testround==this.ROUNDS[r])
    return true;
   }
  }/*r*/
  return false;
  }
return _oui_bd_;
})();

var _oui_bd = (function (_oui_bd_) {
/* Generated from '_oui_bd.nrx' 8 Sep 2000 11:10:50 [v2.00] */
/* Options: Binary Comments Crossref Format Java Logo Strictargs Strictcase Trace2 Verbose3 */
//--package com.ibm.icu.math;
//--import java.math.BigInteger;
//--import com.ibm.icu.impl.Utility;

/* ------------------------------------------------------------------ */
/* _oui_bd -- Decimal arithmetic for Java                          */
/* ------------------------------------------------------------------ */
/* Copyright IBM Corporation, 1996, 2000.  All Rights Reserved.       */
/*                                                                    */
/* The _oui_bd class provides immutable arbitrary-precision        */
/* floating point (including integer) decimal numbers.                */
/*                                                                    */
/* As the numbers are decimal, there is an exact correspondence       */
/* between an instance of a _oui_bd object and its String          */
/* representation; the _oui_bd class provides direct conversions   */
/* to and from String and character array objects, and well as        */
/* conversions to and from the Java primitive types (which may not    */
/* be exact).                                                         */
/* ------------------------------------------------------------------ */
/* Notes:                                                             */
/*                                                                    */
/* 1. A _oui_bd object is never changed in value once constructed; */
/*    this avoids the need for locking.  Note in particular that the  */
/*    mantissa array may be shared between many _oui_bd objects,   */
/*    so that once exposed it must not be altered.                    */
/*                                                                    */
/* 2. This class looks at _oui_bd_ class fields directly (for      */
/*    performance).  It must not and does not change them.            */
/*                                                                    */
/* 3. Exponent checking is delayed until finish(), as we know         */
/*    intermediate calculations cannot cause 31-bit overflow.         */
/*    [This assertion depends on MAX_DIGITS in _oui_bd_.]          */
/*                                                                    */
/* 4. Comments for the public API now follow the javadoc conventions. */
/*    The NetRexx -comments option is used to pass these comments     */
/*    through to the generated Java code (with -format, if desired).  */
/*                                                                    */
/* 5. System.arraycopy is faster than explicit loop as follows        */
/*      Mean length 4:  equal                                         */
/*      Mean length 8:  x2                                            */
/*      Mean length 16: x3                                            */
/*      Mean length 24: x4                                            */
/*    From prior experience, we expect mean length a little below 8,  */
/*    but arraycopy is still the one to use, in general, until later  */
/*    measurements suggest otherwise.                                 */
/*                                                                    */
/* 6. 'DMSRCN' referred to below is the original (1981) IBM S/370     */
/*    assembler code implementation of the algorithms below; it is    */
/*    now called IXXRCN and is available with the OS/390 and VM/ESA   */
/*    operating systems.                                              */
/* ------------------------------------------------------------------ */
/* Change History:                                                    */
/* 1997.09.02 Initial version (derived from netrexx.lang classes)     */
/* 1997.09.12 Add lostDigits checking                                 */
/* 1997.10.06 Change mantissa to a byte array                         */
/* 1997.11.22 Rework power [did not prepare arguments, etc.]          */
/* 1997.12.13 multiply did not prepare arguments                      */
/* 1997.12.14 add did not prepare and align arguments correctly       */
/* 1998.05.02 0.07 packaging changes suggested by Sun and Oracle      */
/* 1998.05.21 adjust remainder operator finalization                  */
/* 1998.06.04 rework to pass _oui_bd_ to finish() and round()      */
/* 1998.06.06 change format to use round(); support rounding modes    */
/* 1998.06.25 rename to _oui_bd and begin merge                    */
/*            zero can now have trailing zeros (i.e., exp\=0)         */
/* 1998.06.28 new methods: movePointXxxx, scale, toBigInteger         */
/*                         unscaledValue, valueof                     */
/* 1998.07.01 improve byteaddsub to allow array reuse, etc.           */
/* 1998.07.01 make null testing explicit to avoid JIT bug [Win32]     */
/* 1998.07.07 scaled division  [divide(_oui_bd, int, int)]         */
/* 1998.07.08 setScale, faster equals                                 */
/* 1998.07.11 allow 1E6 (no sign) <sigh>; new double/float conversion */
/* 1998.10.12 change package to com.ibm.icu.math                          */
/* 1998.12.14 power operator no longer rounds RHS [to match ANSI]     */
/*            add to_oui_bd() and _oui_bd(java.math._oui_bd) */
/* 1998.12.29 improve byteaddsub by using table lookup                */
/* 1999.02.04 lostdigits=0 behaviour rounds instead of digits+1 guard */
/* 1999.02.05 cleaner code for _oui_bd(char[])                     */
/* 1999.02.06 add javadoc comments                                    */
/* 1999.02.11 format() changed from 7 to 2 method form                */
/* 1999.03.05 null pointer checking is no longer explicit             */
/* 1999.03.05 simplify; changes from discussion with J. Bloch:        */
/*            null no longer permitted for _oui_bd_; drop boolean, */
/*            byte, char, float, short constructor, deprecate double  */
/*            constructor, no blanks in string constructor, add       */
/*            offset and length version of char[] constructor;        */
/*            add valueOf(double); drop booleanValue, charValue;      */
/*            add ...Exact versions of remaining convertors           */
/* 1999.03.13 add toBigIntegerExact                                   */
/* 1999.03.13 1.00 release to IBM Centre for Java Technology          */
/* 1999.05.27 1.01 correct 0-0.2 bug under scaled arithmetic          */
/* 1999.06.29 1.02 constructors should not allow exponent > 9 digits  */
/* 1999.07.03 1.03 lost digits should not be checked if digits=0      */
/* 1999.07.06      lost digits Exception message changed              */
/* 1999.07.10 1.04 more work on 0-0.2 (scaled arithmetic)             */
/* 1999.07.17      improve messages from pow method                   */
/* 1999.08.08      performance tweaks                                 */
/* 1999.08.15      fastpath in multiply                               */
/* 1999.11.05 1.05 fix problem in intValueExact [e.g., 5555555555]    */
/* 1999.12.22 1.06 remove multiply fastpath, and improve performance  */
/* 2000.01.01      copyright update [Y2K has arrived]                 */
/* 2000.06.18 1.08 no longer deprecate _oui_bd(double)             */
/* ------------------------------------------------------------------ */


/* JavaScript conversion (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany */



function div(a, b) {
    return (a-(a%b))/b;
}

_oui_bd.prototype.div = div;

function arraycopy(src, srcindex, dest, destindex, length) {
    var i;
    if (destindex > srcindex) {
        // in case src and dest are equals, but also doesn't hurt
        // if they are different
        for (i = length-1; i >= 0; --i) {
            dest[i+destindex] = src[i+srcindex];
        }
    } else {
        for (i = 0; i < length; ++i) {
            dest[i+destindex] = src[i+srcindex];
        }
    }
}

_oui_bd.prototype.arraycopy = arraycopy;

function createArrayWithZeros(length) {
    var retVal = new Array(length);
    var i;
    for (i = 0; i < length; ++i) {
        retVal[i] = 0;
    }
    return retVal;
}

_oui_bd.prototype.createArrayWithZeros = createArrayWithZeros;


/**
 * The <code>_oui_bd</code> class implements immutable
 * arbitrary-precision decimal numbers.  The methods of the
 * <code>_oui_bd</code> class provide operations for fixed and
 * floating point arithmetic, comparison, format conversions, and
 * hashing.
 * <p>
 * As the numbers are decimal, there is an exact correspondence between
 * an instance of a <code>_oui_bd</code> object and its
 * <code>String</code> representation; the <code>_oui_bd</code> class
 * provides direct conversions to and from <code>String</code> and
 * character array (<code>char[]</code>) objects, as well as conversions
 * to and from the Java primitive types (which may not be exact) and
 * <code>BigInteger</code>.
 * <p>
 * In the descriptions of constructors and methods in this documentation,
 * the value of a <code>_oui_bd</code> number object is shown as the
 * result of invoking the <code>toString()</code> method on the object.
 * The internal representation of a decimal number is neither defined
 * nor exposed, and is not permitted to affect the result of any
 * operation.
 * <p>
 * The floating point arithmetic provided by this class is defined by
 * the ANSI X3.274-1996 standard, and is also documented at
 * <code>http://www2.hursley.ibm.com/decimal</code>
 * <br><i>[This URL will change.]</i>
 *
 * <h3>Operator methods</h3>
 * <p>
 * Operations on <code>_oui_bd</code> numbers are controlled by a
 * {@link _oui_bd_} object, which provides the context (precision and
 * other information) for the operation. Methods that can take a
 * <code>_oui_bd_</code> parameter implement the standard arithmetic
 * operators for <code>_oui_bd</code> objects and are known as
 * <i>operator methods</i>.  The default settings provided by the
 * constant {@link _oui_bd_#DEFAULT} (<code>digits=9,
 * form=SCIENTIFIC, lostDigits=false, roundingMode=ROUND_HALF_UP</code>)
 * perform general-purpose floating point arithmetic to nine digits of
 * precision.  The <code>_oui_bd_</code> parameter must not be
 * <code>null</code>.
 * <p>
 * Each operator method also has a version provided which does
 * not take a <code>_oui_bd_</code> parameter.  For this version of
 * each method, the context settings used are <code>digits=0,
 * form=PLAIN, lostDigits=false, roundingMode=ROUND_HALF_UP</code>;
 * these settings perform fixed point arithmetic with unlimited
 * precision, as defined for the original _oui_bd class in Java 1.1
 * and Java 1.2.
 * <p>
 * For monadic operators, only the optional <code>_oui_bd_</code>
 * parameter is present; the operation acts upon the current object.
 * <p>
 * For dyadic operators, a <code>_oui_bd</code> parameter is always
 * present; it must not be <code>null</code>.
 * The operation acts with the current object being the left-hand operand
 * and the <code>_oui_bd</code> parameter being the right-hand operand.
 * <p>
 * For example, adding two <code>_oui_bd</code> objects referred to
 * by the names <code>award</code> and <code>extra</code> could be
 * written as any of:
 * <p><code>
 *     award.add(extra)
 * <br>award.add(extra, _oui_bd_.DEFAULT)
 * <br>award.add(extra, acontext)
 * </code>
 * <p>
 * (where <code>acontext</code> is a <code>_oui_bd_</code> object),
 * which would return a <code>_oui_bd</code> object whose value is
 * the result of adding <code>award</code> and <code>extra</code> under
 * the appropriate context settings.
 * <p>
 * When a <code>_oui_bd</code> operator method is used, a set of
 * rules define what the result will be (and, by implication, how the
 * result would be represented as a character string).
 * These rules are defined in the _oui_bd arithmetic documentation
 * (see the URL above), but in summary:
 * <ul>
 * <li>Results are normally calculated with up to some maximum number of
 * significant digits.
 * For example, if the <code>_oui_bd_</code> parameter for an operation
 * were <code>_oui_bd_.DEFAULT</code> then the result would be
 * rounded to 9 digits; the division of 2 by 3 would then result in
 * 0.666666667.
 * <br>
 * You can change the default of 9 significant digits by providing the
 * method with a suitable <code>_oui_bd_</code> object. This lets you
 * calculate using as many digits as you need -- thousands, if necessary.
 * Fixed point (scaled) arithmetic is indicated by using a
 * <code>digits</code> setting of 0 (or omitting the
 * <code>_oui_bd_</code> parameter).
 * <br>
 * Similarly, you can change the algorithm used for rounding from the
 * default "classic" algorithm.
 * <li>
 * In standard arithmetic (that is, when the <code>form</code> setting
 * is not <code>PLAIN</code>), a zero result is always expressed as the
 * single digit <code>'0'</code> (that is, with no sign, decimal point,
 * or exponent part).
 * <li>
 * Except for the division and power operators in standard arithmetic,
 * trailing zeros are preserved (this is in contrast to binary floating
 * point operations and most electronic calculators, which lose the
 * information about trailing zeros in the fractional part of results).
 * <br>
 * So, for example:
 * <p><code>
 *     new _oui_bd("2.40").add(     new _oui_bd("2"))      =&gt; "4.40"
 * <br>new _oui_bd("2.40").subtract(new _oui_bd("2"))      =&gt; "0.40"
 * <br>new _oui_bd("2.40").multiply(new _oui_bd("2"))      =&gt; "4.80"
 * <br>new _oui_bd("2.40").divide(  new _oui_bd("2"), def) =&gt; "1.2"
 * </code>
 * <p>where the value on the right of the <code>=&gt;</code> would be the
 * result of the operation, expressed as a <code>String</code>, and
 * <code>def</code> (in this and following examples) refers to
 * <code>_oui_bd_.DEFAULT</code>).
 * This preservation of trailing zeros is desirable for most
 * calculations (including financial calculations).
 * If necessary, trailing zeros may be easily removed using division by 1.
 * <li>
 * In standard arithmetic, exponential form is used for a result
 * depending on its value and the current setting of <code>digits</code>
 * (the default is 9 digits).
 * If the number of places needed before the decimal point exceeds the
 * <code>digits</code> setting, or the absolute value of the number is
 * less than <code>0.000001</code>, then the number will be expressed in
 * exponential notation; thus
 * <p><code>
 *   new _oui_bd("1e+6").multiply(new _oui_bd("1e+6"), def)
 * </code>
 * <p>results in <code>1E+12</code> instead of
 * <code>1000000000000</code>, and
 * <p><code>
 *   new _oui_bd("1").divide(new _oui_bd("3E+10"), def)
 * </code>
 * <p>results in <code>3.33333333E-11</code> instead of
 * <code>0.0000000000333333333</code>.
 * <p>
 * The form of the exponential notation (scientific or engineering) is
 * determined by the <code>form</code> setting.
 * <eul>
 * <p>
 * The names of methods in this class follow the conventions established
 * by <code>java.lang.Number</code>, <code>java.math.BigInteger</code>,
 * and <code>java.math._oui_bd</code> in Java 1.1 and Java 1.2.
 *
 * @see     _oui_bd_
 * @author  Mike Cowlishaw
 * @stable ICU 2.0
 */

//--public class _oui_bd extends java.lang.Number implements java.io.Serializable,java.lang.Comparable{
//-- private static final java.lang.String $0="_oui_bd.nrx";

 //-- methods
 _oui_bd.prototype.abs = abs;
 _oui_bd.prototype.add = add;
 _oui_bd.prototype.compareTo = compareTo;
 _oui_bd.prototype.divide = divide;
 _oui_bd.prototype.divideInteger = divideInteger;
 _oui_bd.prototype.max = max;
 _oui_bd.prototype.min = min;
 _oui_bd.prototype.multiply = multiply;
 _oui_bd.prototype.negate = negate;
 _oui_bd.prototype.plus = plus;
 _oui_bd.prototype.pow = pow;
 _oui_bd.prototype.remainder = remainder;
 _oui_bd.prototype.subtract = subtract;
 _oui_bd.prototype.equals = equals;
 _oui_bd.prototype.format = format;
 _oui_bd.prototype.intValueExact = intValueExact;
 _oui_bd.prototype.movePointLeft = movePointLeft;
 _oui_bd.prototype.movePointRight = movePointRight;
 _oui_bd.prototype.scale = scale;
 _oui_bd.prototype.setScale = setScale;
 _oui_bd.prototype.signum = signum;
 _oui_bd.prototype.toString = toString;
 _oui_bd.prototype.layout = layout;
 _oui_bd.prototype.intcheck = intcheck;
 _oui_bd.prototype.dodivide = dodivide;
 _oui_bd.prototype.bad = bad;
 _oui_bd.prototype.badarg = badarg;
 _oui_bd.prototype.extend = extend;
 _oui_bd.prototype.byteaddsub = byteaddsub;
 _oui_bd.prototype.diginit = diginit;
 _oui_bd.prototype.clone = clone;
 _oui_bd.prototype.checkdigits = checkdigits;
 _oui_bd.prototype.round = round;
 _oui_bd.prototype.allzero = allzero;
 _oui_bd.prototype.finish = finish;

 // Convenience methods
 _oui_bd.prototype.isGreaterThan = isGreaterThan;
 _oui_bd.prototype.isLessThan = isLessThan;
 _oui_bd.prototype.isGreaterThanOrEqualTo = isGreaterThanOrEqualTo;
 _oui_bd.prototype.isLessThanOrEqualTo = isLessThanOrEqualTo;
 _oui_bd.prototype.isPositive = isPositive;
 _oui_bd.prototype.isNegative = isNegative;
 _oui_bd.prototype.isZero = isZero;


 /* ----- Constants ----- */
 /* properties constant public */ // useful to others
 // the rounding modes (copied here for upwards compatibility)
 /**
  * Rounding mode to round to a more positive number.
  * @see _oui_bd_#ROUND_CEILING
  * @stable ICU 2.0
  */
 //--public static final int ROUND_CEILING=com.ibm.icu.math._oui_bd_.ROUND_CEILING;
 _oui_bd.ROUND_CEILING = _oui_bd.prototype.ROUND_CEILING = _oui_bd_.prototype.ROUND_CEILING;

 /**
  * Rounding mode to round towards zero.
  * @see _oui_bd_#ROUND_DOWN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_DOWN=com.ibm.icu.math._oui_bd_.ROUND_DOWN;
 _oui_bd.ROUND_DOWN = _oui_bd.prototype.ROUND_DOWN = _oui_bd_.prototype.ROUND_DOWN;

 /**
  * Rounding mode to round to a more negative number.
  * @see _oui_bd_#ROUND_FLOOR
  * @stable ICU 2.0
  */
 //--public static final int ROUND_FLOOR=com.ibm.icu.math._oui_bd_.ROUND_FLOOR;
 _oui_bd.ROUND_FLOOR = _oui_bd.prototype.ROUND_FLOOR = _oui_bd_.prototype.ROUND_FLOOR;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded down.
  * @see _oui_bd_#ROUND_HALF_DOWN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_DOWN=com.ibm.icu.math._oui_bd_.ROUND_HALF_DOWN;
 _oui_bd.ROUND_HALF_DOWN = _oui_bd.prototype.ROUND_HALF_DOWN = _oui_bd_.prototype.ROUND_HALF_DOWN;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded to the nearest even neighbor.
  * @see _oui_bd_#ROUND_HALF_EVEN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_EVEN=com.ibm.icu.math._oui_bd_.ROUND_HALF_EVEN;
 _oui_bd.ROUND_HALF_EVEN = _oui_bd.prototype.ROUND_HALF_EVEN = _oui_bd_.prototype.ROUND_HALF_EVEN;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded up.
  * @see _oui_bd_#ROUND_HALF_UP
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_UP=com.ibm.icu.math._oui_bd_.ROUND_HALF_UP;
 _oui_bd.ROUND_HALF_UP = _oui_bd.prototype.ROUND_HALF_UP = _oui_bd_.prototype.ROUND_HALF_UP;

 /**
  * Rounding mode to assert that no rounding is necessary.
  * @see _oui_bd_#ROUND_UNNECESSARY
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UNNECESSARY=com.ibm.icu.math._oui_bd_.ROUND_UNNECESSARY;
 _oui_bd.ROUND_UNNECESSARY = _oui_bd.prototype.ROUND_UNNECESSARY = _oui_bd_.prototype.ROUND_UNNECESSARY;

 /**
  * Rounding mode to round away from zero.
  * @see _oui_bd_#ROUND_UP
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UP=com.ibm.icu.math._oui_bd_.ROUND_UP;
 _oui_bd.ROUND_UP = _oui_bd.prototype.ROUND_UP = _oui_bd_.prototype.ROUND_UP;

 /* properties constant private */ // locals
 //--private static final byte ispos=1; // ind: indicates positive (must be 1)
 //--private static final byte iszero=0; // ind: indicates zero     (must be 0)
 //--private static final byte isneg=-1; // ind: indicates negative (must be -1)
 _oui_bd.prototype.ispos = 1;
 _oui_bd.prototype.iszero = 0;
 _oui_bd.prototype.isneg = -1;
 // [later could add NaN, +/- infinity, here]

 //--private static final int MinExp=-999999999; // minimum exponent allowed
 //--private static final int MaxExp=999999999; // maximum exponent allowed
 //--private static final int MinArg=-999999999; // minimum argument integer
 //--private static final int MaxArg=999999999; // maximum argument integer
 _oui_bd.prototype.MinExp=-999999999; // minimum exponent allowed
 _oui_bd.prototype.MaxExp=999999999; // maximum exponent allowed
 _oui_bd.prototype.MinArg=-999999999; // minimum argument integer
 _oui_bd.prototype.MaxArg=999999999; // maximum argument integer

 //--private static final com.ibm.icu.math._oui_bd_ plainMC=new com.ibm.icu.math._oui_bd_(0,com.ibm.icu.math._oui_bd_.PLAIN); // context for plain unlimited math
 _oui_bd.prototype.plainMC=new _oui_bd_(0, _oui_bd_.prototype.PLAIN);

 /* properties constant private unused */ // present but not referenced

 // Serialization version
 //--private static final long serialVersionUID=8245355804974198832L;

 //--private static final java.lang.String copyright=" Copyright (c) IBM Corporation 1996, 2000.  All rights reserved. ";

 /* properties static private */
 // Precalculated constant arrays (used by byteaddsub)
 //--private static byte bytecar[]=new byte[(90+99)+1]; // carry/borrow array
 //--private static byte bytedig[]=diginit(); // next digit array
 _oui_bd.prototype.bytecar = new Array((90+99)+1);
 _oui_bd.prototype.bytedig = diginit();

 /**
  * The <code>_oui_bd</code> constant "0".
  *
  * @see #ONE
  * @see #TEN
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math._oui_bd ZERO=new com.ibm.icu.math._oui_bd((long)0); // use long as we want the int constructor
 // .. to be able to use this, for speed
_oui_bd.ZERO = _oui_bd.prototype.ZERO = new _oui_bd("0");

 /**
  * The <code>_oui_bd</code> constant "1".
  *
  * @see #TEN
  * @see #ZERO
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math._oui_bd ONE=new com.ibm.icu.math._oui_bd((long)1); // use long as we want the int constructor
 // .. to be able to use this, for speed
_oui_bd.ONE = _oui_bd.prototype.ONE = new _oui_bd("1");

 /**
  * The <code>_oui_bd</code> constant "10".
  *
  * @see #ONE
  * @see #ZERO
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math._oui_bd TEN=new com.ibm.icu.math._oui_bd(10);
 _oui_bd.TEN = _oui_bd.prototype.TEN = new _oui_bd("10");

 /* ----- Instance properties [all private and immutable] ----- */
 /* properties private */

 /**
  * The indicator. This may take the values:
  * <ul>
  * <li>ispos  -- the number is positive
  * <li>iszero -- the number is zero
  * <li>isneg  -- the number is negative
  * </ul>
  *
  * @serial
  */
 //--private byte ind; // assumed undefined
 // Note: some code below assumes IND = Sign [-1, 0, 1], at present.
 // We only need two bits for this, but use a byte [also permits
 // smooth future extension].

 /**
  * The formatting style. This may take the values:
  * <ul>
  * <li>_oui_bd_.PLAIN        -- no exponent needed
  * <li>_oui_bd_.SCIENTIFIC   -- scientific notation required
  * <li>_oui_bd_.ENGINEERING  -- engineering notation required
  * </ul>
  * <p>
  * This property is an optimization; it allows us to defer number
  * layout until it is actually needed as a string, hence avoiding
  * unnecessary formatting.
  *
  * @serial
  */
 //--private byte form=(byte)com.ibm.icu.math._oui_bd_.PLAIN; // assumed PLAIN
 // We only need two bits for this, at present, but use a byte
 // [again, to allow for smooth future extension]

 /**
  * The value of the mantissa.
  * <p>
  * Once constructed, this may become shared between several _oui_bd
  * objects, so must not be altered.
  * <p>
  * For efficiency (speed), this is a byte array, with each byte
  * taking a value of 0 -> 9.
  * <p>
  * If the first byte is 0 then the value of the number is zero (and
  * mant.length=1, except when constructed from a plain number, for
  * example, 0.000).
  *
  * @serial
  */
 //--private byte mant[]; // assumed null

 /**
  * The exponent.
  * <p>
  * For fixed point arithmetic, scale is <code>-exp</code>, and can
  * apply to zero.
  *
  * Note that this property can have a value less than MinExp when
  * the mantissa has more than one digit.
  *
  * @serial
  */
 //--private int exp;
 // assumed 0

 /* ---------------------------------------------------------------- */
 /* Constructors                                                     */
 /* ---------------------------------------------------------------- */

 /**
  * Constructs a <code>_oui_bd</code> object from a
  * <code>java.math._oui_bd</code>.
  * <p>
  * Constructs a <code>_oui_bd</code> as though the parameter had
  * been represented as a <code>String</code> (using its
  * <code>toString</code> method) and the
  * {@link #_oui_bd(java.lang.String)} constructor had then been
  * used.
  * The parameter must not be <code>null</code>.
  * <p>
  * <i>(Note: this constructor is provided only in the
  * <code>com.ibm.icu.math</code> version of the _oui_bd class.
  * It would not be present in a <code>java.math</code> version.)</i>
  *
  * @param bd The <code>_oui_bd</code> to be translated.
  * @stable ICU 2.0
  */

 //--public _oui_bd(java.math._oui_bd bd){
 //-- this(bd.toString());
 //-- return;}

 /**
  * Constructs a <code>_oui_bd</code> object from a
  * <code>BigInteger</code>, with scale 0.
  * <p>
  * Constructs a <code>_oui_bd</code> which is the exact decimal
  * representation of the <code>BigInteger</code>, with a scale of
  * zero.
  * The value of the <code>_oui_bd</code> is identical to the value
  * of the <code>BigInteger</code>.
  * The parameter must not be <code>null</code>.
  * <p>
  * The <code>_oui_bd</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the
  * <code>BigInteger</code> is negative.  A leading zero will be
  * present only if the <code>BigInteger</code> is zero.
  *
  * @param bi The <code>BigInteger</code> to be converted.
  * @stable ICU 2.0
  */

 //--public _oui_bd(java.math.BigInteger bi){
 //-- this(bi.toString(10));
 //-- return;}
 // exp remains 0

 /**
  * Constructs a <code>_oui_bd</code> object from a
  * <code>BigInteger</code> and a scale.
  * <p>
  * Constructs a <code>_oui_bd</code> which is the exact decimal
  * representation of the <code>BigInteger</code>, scaled by the
  * second parameter, which may not be negative.
  * The value of the <code>_oui_bd</code> is the
  * <code>BigInteger</code> divided by ten to the power of the scale.
  * The <code>BigInteger</code> parameter must not be
  * <code>null</code>.
  * <p>
  * The <code>_oui_bd</code> will contain only decimal digits, (with
  * an embedded decimal point followed by <code>scale</code> decimal
  * digits if the scale is positive), prefixed with a leading minus
  * sign (hyphen) if the <code>BigInteger</code> is negative.  A
  * leading zero will be present only if the <code>BigInteger</code> is
  * zero.
  *
  * @param  bi    The <code>BigInteger</code> to be converted.
  * @param  scale The <code>int</code> specifying the scale.
  * @throws NumberFormatException if the scale is negative.
  * @stable ICU 2.0
  */

 //--public _oui_bd(java.math.BigInteger bi,int scale){
 //-- this(bi.toString(10));
 //-- if (scale<0)
 //--  throw new java.lang.NumberFormatException("Negative scale:"+" "+scale);
 //-- exp=(int)-scale; // exponent is -scale
 //-- return;}

 /**
  * Constructs a <code>_oui_bd</code> object from an array of characters.
  * <p>
  * Constructs a <code>_oui_bd</code> as though a
  * <code>String</code> had been constructed from the character array
  * and the {@link #_oui_bd(java.lang.String)} constructor had then
  * been used. The parameter must not be <code>null</code>.
  * <p>
  * Using this constructor is faster than using the
  * <code>_oui_bd(String)</code> constructor if the string is
  * already available in character array form.
  *
  * @param inchars The <code>char[]</code> array containing the number
  *                to be converted.
  * @throws NumberFormatException if the parameter is not a valid
  *                number.
  * @stable ICU 2.0
  */

 //--public _oui_bd(char inchars[]){
 //-- this(inchars,0,inchars.length);
 //-- return;}

 /**
  * Constructs a <code>_oui_bd</code> object from an array of characters.
  * <p>
  * Constructs a <code>_oui_bd</code> as though a
  * <code>String</code> had been constructed from the character array
  * (or a subarray of that array) and the
  * {@link #_oui_bd(java.lang.String)} constructor had then been
  * used. The first parameter must not be <code>null</code>, and the
  * subarray must be wholly contained within it.
  * <p>
  * Using this constructor is faster than using the
  * <code>_oui_bd(String)</code> constructor if the string is
  * already available within a character array.
  *
  * @param inchars The <code>char[]</code> array containing the number
  *                to be converted.
  * @param offset  The <code>int</code> offset into the array of the
  *                start of the number to be converted.
  * @param length  The <code>int</code> length of the number.
  * @throws NumberFormatException if the parameter is not a valid
  *                number for any reason.
  * @stable ICU 2.0
  */

 //--public _oui_bd(char inchars[],int offset,int length){super();
 function _oui_bd() {
  //-- members
  this.ind = 0;
  this.form = _oui_bd_.prototype.PLAIN;
  this.mant = null;
  this.exp = 0;

  //-- overloaded ctor
  if (_oui_bd.arguments.length == 0)
   return;
  var inchars;
  var offset;
  var length;
  if (_oui_bd.arguments.length == 1)
   {
    inchars = _oui_bd.arguments[0];
    offset = 0;
    length = inchars.length;
   }
  else
   {
    inchars = _oui_bd.arguments[0];
    offset = _oui_bd.arguments[1];
    length = _oui_bd.arguments[2];
   }
  if (typeof inchars == "string")
   {
    inchars = inchars.split("");
   }

  //--boolean exotic;
  var exotic;
  //--boolean hadexp;
  var hadexp;
  //--int d;
  var d;
  //--int dotoff;
  var dotoff;
  //--int last;
  var last;
  //--int i=0;
  var i=0;
  //--char si=0;
  var si=0;
  //--boolean eneg=false;
  var eneg=false;
  //--int k=0;
  var k=0;
  //--int elen=0;
  var elen=0;
  //--int j=0;
  var j=0;
  //--char sj=0;
  var sj=0;
  //--int dvalue=0;
  var dvalue=0;
  //--int mag=0;
  var mag=0;
  // This is the primary constructor; all incoming strings end up
  // here; it uses explicit (inline) parsing for speed and to avoid
  // generating intermediate (temporary) objects of any kind.
  // 1998.06.25: exponent form built only if E/e in string
  // 1998.06.25: trailing zeros not removed for zero
  // 1999.03.06: no embedded blanks; allow offset and length
  if (length<=0)
   this.bad("_oui_bd(): ", inchars); // bad conversion (empty string)
  // [bad offset will raise array bounds exception]

  /* Handle and step past sign */
  this.ind=this.ispos; // assume positive
  if (inchars[0]==('-'))
   {
    length--;
    if (length==0)
     this.bad("_oui_bd(): ", inchars); // nothing after sign
    this.ind=this.isneg;
    offset++;
   }
  else
   if (inchars[0]==('+'))
    {
     length--;
     if (length==0)
      this.bad("_oui_bd(): ", inchars); // nothing after sign
     offset++;
    }

  /* We're at the start of the number */
  exotic=false; // have extra digits
  hadexp=false; // had explicit exponent
  d=0; // count of digits found
  dotoff=-1; // offset where dot was found
  last=-1; // last character of mantissa
  {var $1=length;i=offset;i:for(;$1>0;$1--,i++){
   si=inchars[i];
   if (si>='0')  // test for Arabic digit
    if (si<='9')
     {
      last=i;
      d++; // still in mantissa
      continue i;
     }
   if (si=='.')
    { // record and ignore
     if (dotoff>=0)
      this.bad("_oui_bd(): ", inchars); // two dots
     dotoff=i-offset; // offset into mantissa
     continue i;
    }
   if (si!='e')
    if (si!='E')
     { // expect an extra digit
      if (si<'0' || si>'9')
       this.bad("_oui_bd(): ", inchars); // not a number
      // defer the base 10 check until later to avoid extra method call
      exotic=true; // will need conversion later
      last=i;
      d++; // still in mantissa
      continue i;
     }
   /* Found 'e' or 'E' -- now process explicit exponent */
   // 1998.07.11: sign no longer required
   if ((i-offset)>(length-2))
    this.bad("_oui_bd(): ", inchars); // no room for even one digit
   eneg=false;
   if ((inchars[i+1])==('-'))
    {
     eneg=true;
     k=i+2;
    }
   else
    if ((inchars[i+1])==('+'))
     k=i+2;
    else
     k=i+1;
   // k is offset of first expected digit
   elen=length-((k-offset)); // possible number of digits
   if ((elen==0)||(elen>9))
    this.bad("_oui_bd(): ", inchars); // 0 or more than 9 digits
   {var $2=elen;j=k;j:for(;$2>0;$2--,j++){
    sj=inchars[j];
    if (sj<'0')
     this.bad("_oui_bd(): ", inchars); // always bad
    if (sj>'9')
     { // maybe an exotic digit
      /*if (si<'0' || si>'9')
       this.bad(inchars); // not a number
      dvalue=java.lang.Character.digit(sj,10); // check base
      if (dvalue<0)
       bad(inchars); // not base 10*/
      this.bad("_oui_bd(): ", inchars);
     }
    else
     dvalue=sj-'0';
    this.exp=(this.exp*10)+dvalue;
    }
   }/*j*/
   if (eneg)
    this.exp=-this.exp; // was negative
   hadexp=true; // remember we had one
   break i; // we are done
   }
  }/*i*/

  /* Here when all inspected */
  if (d==0)
   this.bad("_oui_bd(): ", inchars); // no mantissa digits
  if (dotoff>=0)
   this.exp=(this.exp+dotoff)-d; // adjust exponent if had dot

  /* strip leading zeros/dot (leave final if all 0's) */
  {var $3=last-1;i=offset;i:for(;i<=$3;i++){
   si=inchars[i];
   if (si=='0')
    {
     offset++;
     dotoff--;
     d--;
    }
   else
    if (si=='.')
     {
      offset++; // step past dot
      dotoff--;
     }
    else
     if (si<='9')
      break i;/* non-0 */
     else
      {/* exotic */
       //if ((java.lang.Character.digit(si,10))!=0)
        break i; // non-0 or bad
       // is 0 .. strip like '0'
       //offset++;
       //dotoff--;
       //d--;
      }
   }
  }/*i*/

  /* Create the mantissa array */
  this.mant=new Array(d); // we know the length
  j=offset; // input offset
  if (exotic)
   {exotica:do{ // slow: check for exotica
    {var $4=d;i=0;i:for(;$4>0;$4--,i++){
     if (i==dotoff)
      j++; // at dot
     sj=inchars[j];
     if (sj<='9')
      this.mant[i]=sj-'0';/* easy */
     else
      {
       //dvalue=java.lang.Character.digit(sj,10);
       //if (dvalue<0)
        this.bad("_oui_bd(): ", inchars); // not a number after all
       //mant[i]=(byte)dvalue;
      }
     j++;
     }
    }/*i*/
   }while(false);}/*exotica*/
  else
   {simple:do{
    {var $5=d;i=0;i:for(;$5>0;$5--,i++){
     if (i==dotoff)
      j++;
     this.mant[i]=inchars[j]-'0';
     j++;
     }
    }/*i*/
   }while(false);}/*simple*/

  /* Looks good.  Set the sign indicator and form, as needed. */
  // Trailing zeros are preserved
  // The rule here for form is:
  //   If no E-notation, then request plain notation
  //   Otherwise act as though add(0,DEFAULT) and request scientific notation
  // [form is already PLAIN]
  if (this.mant[0]==0)
   {
    this.ind=this.iszero; // force to show zero
    // negative exponent is significant (e.g., -3 for 0.000) if plain
    if (this.exp>0)
     this.exp=0; // positive exponent can be ignored
    if (hadexp)
     { // zero becomes single digit from add
      this.mant=this.ZERO.mant;
      this.exp=0;
     }
   }
  else
   { // non-zero
    // [ind was set earlier]
    // now determine form
    if (hadexp)
     {
      this.form=_oui_bd_.prototype.SCIENTIFIC;
      // 1999.06.29 check for overflow
      mag=(this.exp+this.mant.length)-1; // true exponent in scientific notation
      if ((mag<this.MinExp)||(mag>this.MaxExp))
       this.bad("_oui_bd(): ", inchars);
     }
   }
  // say 'BD(c[]): mant[0] mantlen exp ind form:' mant[0] mant.length exp ind form
  return;
  }

 /**
  * Constructs a <code>_oui_bd</code> object directly from a
  * <code>double</code>.
  * <p>
  * Constructs a <code>_oui_bd</code> which is the exact decimal
  * representation of the 64-bit signed binary floating point
  * parameter.
  * <p>
  * Note that this constructor it an exact conversion; it does not give
  * the same result as converting <code>num</code> to a
  * <code>String</code> using the <code>Double.toString()</code> method
  * and then using the {@link #_oui_bd(java.lang.String)}
  * constructor.
  * To get that result, use the static {@link #valueOf(double)}
  * method to construct a <code>_oui_bd</code> from a
  * <code>double</code>.
  *
  * @param num The <code>double</code> to be converted.
  * @throws NumberFormatException if the parameter is infinite or
  *            not a number.
  * @stable ICU 2.0
  */

 //--public _oui_bd(double num){
 //-- // 1999.03.06: use exactly the old algorithm
 //-- // 2000.01.01: note that this constructor does give an exact result,
 //-- //             so perhaps it should not be deprecated
 //-- // 2000.06.18: no longer deprecated
 //-- this((new java.math._oui_bd(num)).toString());
 //-- return;}

 /**
  * Constructs a <code>_oui_bd</code> object directly from a
  * <code>int</code>.
  * <p>
  * Constructs a <code>_oui_bd</code> which is the exact decimal
  * representation of the 32-bit signed binary integer parameter.
  * The <code>_oui_bd</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the parameter is
  * negative.
  * A leading zero will be present only if the parameter is zero.
  *
  * @param num The <code>int</code> to be converted.
  * @stable ICU 2.0
  */

 //--public _oui_bd(int num){super();
 //-- int mun;
 //-- int i=0;
 //-- // We fastpath commoners
 //-- if (num<=9)
 //--  if (num>=(-9))
 //--   {singledigit:do{
 //--    // very common single digit case
 //--    {/*select*/
 //--    if (num==0)
 //--     {
 //--      mant=ZERO.mant;
 //--      ind=iszero;
 //--     }
 //--    else if (num==1)
 //--     {
 //--      mant=ONE.mant;
 //--      ind=ispos;
 //--     }
 //--    else if (num==(-1))
 //--     {
 //--      mant=ONE.mant;
 //--      ind=isneg;
 //--     }
 //--    else{
 //--     {
 //--      mant=new byte[1];
 //--      if (num>0)
 //--       {
 //--        mant[0]=(byte)num;
 //--        ind=ispos;
 //--       }
 //--      else
 //--       { // num<-1
 //--        mant[0]=(byte)((int)-num);
 //--        ind=isneg;
 //--       }
 //--     }
 //--    }
 //--    }
 //--    return;
 //--   }while(false);}/*singledigit*/
 //--
 //-- /* We work on negative numbers so we handle the most negative number */
 //-- if (num>0)
 //--  {
 //--   ind=ispos;
 //--   num=(int)-num;
 //--  }
 //-- else
 //--  ind=isneg;/* negative */ // [0 case already handled]
 //-- // [it is quicker, here, to pre-calculate the length with
 //-- // one loop, then allocate exactly the right length of byte array,
 //-- // then re-fill it with another loop]
 //-- mun=num; // working copy
 //-- {i=9;i:for(;;i--){
 //--  mun=mun/10;
 //--  if (mun==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- // i is the position of the leftmost digit placed
 //-- mant=new byte[10-i];
 //-- {i=(10-i)-1;i:for(;;i--){
 //--  mant[i]=(byte)-(((byte)(num%10)));
 //--  num=num/10;
 //--  if (num==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- return;
 //-- }

 /**
  * Constructs a <code>_oui_bd</code> object directly from a
  * <code>long</code>.
  * <p>
  * Constructs a <code>_oui_bd</code> which is the exact decimal
  * representation of the 64-bit signed binary integer parameter.
  * The <code>_oui_bd</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the parameter is
  * negative.
  * A leading zero will be present only if the parameter is zero.
  *
  * @param num The <code>long</code> to be converted.
  * @stable ICU 2.0
  */

 //--public _oui_bd(long num){super();
 //-- long mun;
 //-- int i=0;
 //-- // Not really worth fastpathing commoners in this constructor [also,
 //-- // we use this to construct the static constants].
 //-- // This is much faster than: this(String.valueOf(num).toCharArray())
 //-- /* We work on negative num so we handle the most negative number */
 //-- if (num>0)
 //--  {
 //--   ind=ispos;
 //--   num=(long)-num;
 //--  }
 //-- else
 //--  if (num==0)
 //--   ind=iszero;
 //--  else
 //--   ind=isneg;/* negative */
 //-- mun=num;
 //-- {i=18;i:for(;;i--){
 //--  mun=mun/10;
 //--  if (mun==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- // i is the position of the leftmost digit placed
 //-- mant=new byte[19-i];
 //-- {i=(19-i)-1;i:for(;;i--){
 //--  mant[i]=(byte)-(((byte)(num%10)));
 //--  num=num/10;
 //--  if (num==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- return;
 //-- }

 /**
  * Constructs a <code>_oui_bd</code> object from a <code>String</code>.
  * <p>
  * Constructs a <code>_oui_bd</code> from the parameter, which must
  * not be <code>null</code> and must represent a valid <i>number</i>,
  * as described formally in the documentation referred to
  * {@link _oui_bd above}.
  * <p>
  * In summary, numbers in <code>String</code> form must have at least
  * one digit, may have a leading sign, may have a decimal point, and
  * exponential notation may be used.  They follow conventional syntax,
  * and may not contain blanks.
  * <p>
  * Some valid strings from which a <code>_oui_bd</code> might
  * be constructed are:
  * <pre>
  *       "0"         -- Zero
  *      "12"         -- A whole number
  *     "-76"         -- A signed whole number
  *      "12.70"      -- Some decimal places
  *     "+0.003"      -- Plus sign is allowed
  *      "17."        -- The same as 17
  *        ".5"       -- The same as 0.5
  *      "4E+9"       -- Exponential notation
  *       "0.73e-7"   -- Exponential notation
  * </pre>
  * <p>
  * (Exponential notation means that the number includes an optional
  * sign and a power of ten following an '</code>E</code>' that
  * indicates how the decimal point will be shifted.  Thus the
  * <code>"4E+9"</code> above is just a short way of writing
  * <code>4000000000</code>, and the <code>"0.73e-7"</code> is short
  * for <code>0.000000073</code>.)
  * <p>
  * The <code>_oui_bd</code> constructed from the String is in a
  * standard form, with no blanks, as though the
  * {@link #add(_oui_bd)} method had been used to add zero to the
  * number with unlimited precision.
  * If the string uses exponential notation (that is, includes an
  * <code>e</code> or an <code>E</code>), then the
  * <code>_oui_bd</code> number will be expressed in scientific
  * notation (where the power of ten is adjusted so there is a single
  * non-zero digit to the left of the decimal point); in this case if
  * the number is zero then it will be expressed as the single digit 0,
  * and if non-zero it will have an exponent unless that exponent would
  * be 0.  The exponent must fit in nine digits both before and after it
  * is expressed in scientific notation.
  * <p>
  * Any digits in the parameter must be decimal; that is,
  * <code>Character.digit(c, 10)</code> (where </code>c</code> is the
  * character in question) would not return -1.
  *
  * @param string The <code>String</code> to be converted.
  * @throws NumberFormatException if the parameter is not a valid
  * number.
  * @stable ICU 2.0
  */

 //--public _oui_bd(java.lang.String string){
 //-- this(string.toCharArray(),0,string.length());
 //-- return;}

 /* <sgml> Make a default _oui_bd object for local use. </sgml> */

 //--private _oui_bd(){super();
 //-- return;
 //-- }

 /* ---------------------------------------------------------------- */
 /* Operator methods [methods which take a context parameter]        */
 /* ---------------------------------------------------------------- */

 /**
  * Returns a plain <code>_oui_bd</code> whose value is the absolute
  * value of this <code>_oui_bd</code>.
  * <p>
  * The same as {@link #abs(_oui_bd_)}, where the context is
  * <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will
  * be <code>this.scale()</code>
  *
  * @return A <code>_oui_bd</code> whose value is the absolute
  *         value of this <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd abs(){
 //- return this.abs(plainMC);
 //- }

 /**
  * Returns a <code>_oui_bd</code> whose value is the absolute value
  * of this <code>_oui_bd</code>.
  * <p>
  * If the current object is zero or positive, then the same result as
  * invoking the {@link #plus(_oui_bd_)} method with the same
  * parameter is returned.
  * Otherwise, the same result as invoking the
  * {@link #negate(_oui_bd_)} method with the same parameter is
  * returned.
  *
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is the absolute
  *             value of this <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd abs(com.ibm.icu.math._oui_bd_ set){
 function abs() {
  var set;
  if (abs.arguments.length == 1)
   {
    set = abs.arguments[0];
   }
  else if (abs.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "abs(): " + abs.arguments.length + " arguments given; expected 0 or 1";
   }
  if (this.ind==this.isneg)
   return this.negate(set);
  return this.plus(set);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this+rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #add(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the maximum of the scales of the two operands.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the addition.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this+rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd add(com.ibm.icu.math._oui_bd rhs){
 //-- return this.add(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>this+rhs</code>.
  * <p>
  * Implements the addition (<b><code>+</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the addition.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this+rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd add(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function add() {
  var set;
  if (add.arguments.length == 2)
   {
    set = add.arguments[1];
   }
  else if (add.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "add(): " + add.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = add.arguments[0];
  //--com.ibm.icu.math._oui_bd lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //--com.ibm.icu.math._oui_bd res;
  var res;
  //--byte usel[];
  var usel;
  //--int usellen;
  var usellen;
  //--byte user[];
  var user;
  //--int userlen;
  var userlen;
  //--int newlen=0;
  var newlen=0;
  //--int tlen=0;
  var tlen=0;
  //--int mult=0;
  var mult=0;
  //--byte t[]=null;
  var t=null;
  //--int ia=0;
  var ia=0;
  //--int ib=0;
  var ib=0;
  //--int ea=0;
  var ea=0;
  //int eb=0;
  var eb=0;
  //byte ca=0;
  var ca=0;
  //--byte cb=0;
  var cb=0;
  /* determine requested digits and form */
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity and proxy

  /* Quick exit for add floating 0 */
  // plus() will optimize to return same object if possible
  if (lhs.ind==0)
   if (set.form!=_oui_bd_.prototype.PLAIN)
    return rhs.plus(set);
  if (rhs.ind==0)
   if (set.form!=_oui_bd_.prototype.PLAIN)
    return lhs.plus(set);

  /* Prepare numbers (round, unless unlimited precision) */
  reqdig=set.digits; // local copy (heavily used)
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   // [we could reuse the new LHS for result in this case]
   }

  res=new _oui_bd(); // build result here

  /* Now see how much we have to pad or truncate lhs or rhs in order
     to align the numbers.  If one number is much larger than the
     other, then the smaller cannot affect the answer [but we may
     still need to pad with up to DIGITS trailing zeros]. */
  // Note sign may be 0 if digits (reqdig) is 0
  // usel and user will be the byte arrays passed to the adder; we'll
  // use them on all paths except quick exits
  usel=lhs.mant;
  usellen=lhs.mant.length;
  user=rhs.mant;
  userlen=rhs.mant.length;
  {padder:do{/*select*/
  if (lhs.exp==rhs.exp)
   {/* no padding needed */
    // This is the most common, and fastest, path
    res.exp=lhs.exp;
   }
  else if (lhs.exp>rhs.exp)
   { // need to pad lhs and/or truncate rhs
    newlen=(usellen+lhs.exp)-rhs.exp;
    /* If, after pad, lhs would be longer than rhs by digits+1 or
       more (and digits>0) then rhs cannot affect answer, so we only
       need to pad up to a length of DIGITS+1. */
    if (newlen>=((userlen+reqdig)+1))
     if (reqdig>0)
      {
       // LHS is sufficient
       res.mant=usel;
       res.exp=lhs.exp;
       res.ind=lhs.ind;
       if (usellen<reqdig)
        { // need 0 padding
         res.mant=this.extend(lhs.mant,reqdig);
         res.exp=res.exp-((reqdig-usellen));
        }
       return res.finish(set,false);
      }
    // RHS may affect result
    res.exp=rhs.exp; // expected final exponent
    if (newlen>(reqdig+1))
     if (reqdig>0)
      {
       // LHS will be max; RHS truncated
       tlen=(newlen-reqdig)-1; // truncation length
       userlen=userlen-tlen;
       res.exp=res.exp+tlen;
       newlen=reqdig+1;
      }
    if (newlen>usellen)
     usellen=newlen; // need to pad LHS
   }
  else{ // need to pad rhs and/or truncate lhs
   newlen=(userlen+rhs.exp)-lhs.exp;
   if (newlen>=((usellen+reqdig)+1))
    if (reqdig>0)
     {
      // RHS is sufficient
      res.mant=user;
      res.exp=rhs.exp;
      res.ind=rhs.ind;
      if (userlen<reqdig)
       { // need 0 padding
        res.mant=this.extend(rhs.mant,reqdig);
        res.exp=res.exp-((reqdig-userlen));
       }
      return res.finish(set,false);
     }
   // LHS may affect result
   res.exp=lhs.exp; // expected final exponent
   if (newlen>(reqdig+1))
    if (reqdig>0)
     {
      // RHS will be max; LHS truncated
      tlen=(newlen-reqdig)-1; // truncation length
      usellen=usellen-tlen;
      res.exp=res.exp+tlen;
      newlen=reqdig+1;
     }
   if (newlen>userlen)
    userlen=newlen; // need to pad RHS
  }
  }while(false);}/*padder*/

  /* OK, we have aligned mantissas.  Now add or subtract. */
  // 1998.06.27 Sign may now be 0 [e.g., 0.000] .. treat as positive
  // 1999.05.27 Allow for 00 on lhs [is not larger than 2 on rhs]
  // 1999.07.10 Allow for 00 on rhs [is not larger than 2 on rhs]
  if (lhs.ind==this.iszero)
   res.ind=this.ispos;
  else
   res.ind=lhs.ind; // likely sign, all paths
  if (((lhs.ind==this.isneg)?1:0)==((rhs.ind==this.isneg)?1:0))  // same sign, 0 non-negative
   mult=1;
  else
   {signdiff:do{ // different signs, so subtraction is needed
    mult=-1; // will cause subtract
    /* Before we can subtract we must determine which is the larger,
       as our add/subtract routine only handles non-negative results
       so we may need to swap the operands. */
    {swaptest:do{/*select*/
    if (rhs.ind==this.iszero)
     {} // original A bigger
    else if ((usellen<userlen)||(lhs.ind==this.iszero))
     { // original B bigger
      t=usel;
      usel=user;
      user=t; // swap
      tlen=usellen;
      usellen=userlen;
      userlen=tlen; // ..
      res.ind=-res.ind; // and set sign
     }
    else if (usellen>userlen)
     {} // original A bigger
    else{
     {/* logical lengths the same */ // need compare
      /* may still need to swap: compare the strings */
      ia=0;
      ib=0;
      ea=usel.length-1;
      eb=user.length-1;
      {compare:for(;;){
       if (ia<=ea)
        ca=usel[ia];
       else
        {
         if (ib>eb)
          {/* identical */
           if (set.form!=_oui_bd_.prototype.PLAIN)
            return this.ZERO;
           // [if PLAIN we must do the subtract, in case of 0.000 results]
           break compare;
          }
         ca=0;
        }
       if (ib<=eb)
        cb=user[ib];
       else
        cb=0;
       if (ca!=cb)
        {
         if (ca<cb)
          {/* swap needed */
           t=usel;
           usel=user;
           user=t; // swap
           tlen=usellen;
           usellen=userlen;
           userlen=tlen; // ..
           res.ind=-res.ind;
          }
         break compare;
        }
       /* mantissas the same, so far */
       ia++;
       ib++;
       }
      }/*compare*/
     } // lengths the same
    }
    }while(false);}/*swaptest*/
   }while(false);}/*signdiff*/

  /* here, A is > B if subtracting */
  // add [A+B*1] or subtract [A+(B*-1)]
  res.mant=this.byteaddsub(usel,usellen,user,userlen,mult,false);
  // [reuse possible only after chop; accounting makes not worthwhile]

  // Finish() rounds before stripping leading 0's, then sets form, etc.
  return res.finish(set,false);
  }

 /**
  * Compares this <code>_oui_bd</code> to another, using unlimited
  * precision.
  * <p>
  * The same as {@link #compareTo(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @see    #compareTo(Object)
  * @stable ICU 2.0
  */

 //--public int compareTo(com.ibm.icu.math._oui_bd rhs){
 //-- return this.compareTo(rhs,plainMC);
 //-- }

 /**
  * Compares this <code>_oui_bd</code> to another.
  * <p>
  * Implements numeric comparison,
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns a result of type <code>int</code>.
  * <p>
  * The result will be:
  * <table cellpadding=2><tr>
  * <td align=right><b>-1</b></td>
  * <td>if the current object is less than the first parameter</td>
  * </tr><tr>
  * <td align=right><b>0</b></td>
  * <td>if the current object is equal to the first parameter</td>
  * </tr><tr>
  * <td align=right><b>1</b></td>
  * <td>if the current object is greater than the first parameter.</td>
  * </tr></table>
  * <p>
  * A {@link #compareTo(Object)} method is also provided.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @see    #compareTo(Object)
  * @stable ICU 2.0
  */

 //public int compareTo(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function compareTo() {
  var set;
  if (compareTo.arguments.length == 2)
   {
    set = compareTo.arguments[1];
   }
  else if (compareTo.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "compareTo(): " + compareTo.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = compareTo.arguments[0];
  //--int thislength=0;
  var thislength=0;
  //--int i=0;
  var i=0;
  //--com.ibm.icu.math._oui_bd newrhs;
  var newrhs;
  // rhs=null will raise NullPointerException, as per Comparable interface
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  // [add will recheck in slowpath cases .. but would report -rhs]
  if ((this.ind==rhs.ind)&&(this.exp==rhs.exp))
   {
    /* sign & exponent the same [very common] */
    thislength=this.mant.length;
    if (thislength<rhs.mant.length)
     return -this.ind;
    if (thislength>rhs.mant.length)
     return this.ind;
    /* lengths are the same; we can do a straight mantissa compare
       unless maybe rounding [rounding is very unusual] */
    if ((thislength<=set.digits)||(set.digits==0))
     {
      {var $6=thislength;i=0;i:for(;$6>0;$6--,i++){
       if (this.mant[i]<rhs.mant[i])
        return -this.ind;
       if (this.mant[i]>rhs.mant[i])
        return this.ind;
       }
      }/*i*/
      return 0; // identical
     }
   /* drop through for full comparison */
   }
  else
   {
    /* More fastpaths possible */
    if (this.ind<rhs.ind)
     return -1;
    if (this.ind>rhs.ind)
     return 1;
   }
  /* carry out a subtract to make the comparison */
  newrhs=this.clone(rhs); // safe copy
  newrhs.ind=-newrhs.ind; // prepare to subtract
  return this.add(newrhs,set).ind; // add, and return sign of result
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #divide(_oui_bd, int)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the rounding mode is {@link _oui_bd_#ROUND_HALF_UP}.
  *
  * The length of the decimal part (the scale) of the result will be
  * the same as the scale of the current object, if the latter were
  * formatted without exponential notation.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the division.
  * @return     A plain <code>_oui_bd</code> whose value is
  *             <code>this/rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divide(com.ibm.icu.math._oui_bd rhs){
 //-- return this.dodivide('D',rhs,plainMC,-1);
 //-- }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic and a
  * rounding mode.
  * <p>
  * The same as {@link #divide(_oui_bd, int, int)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the second parameter is <code>this.scale()</code>, and
  * the third is <code>round</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will
  * therefore be the same as the scale of the current object, if the
  * latter were formatted without exponential notation.
  * <p>
  * @param  rhs   The <code>_oui_bd</code> for the right hand side of
  *               the division.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link _oui_bd_} class).
  * @return       A plain <code>_oui_bd</code> whose value is
  *               <code>this/rhs</code>, using fixed point arithmetic
  *               and the specified rounding mode.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if <code>round</code> is {@link
  *               _oui_bd_#ROUND_UNNECESSARY} and
  *               <code>this.scale()</code> is insufficient to
  *               represent the result exactly.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divide(com.ibm.icu.math._oui_bd rhs,int round){
 //-- com.ibm.icu.math._oui_bd_ set;
 //-- set=new com.ibm.icu.math._oui_bd_(0,com.ibm.icu.math._oui_bd_.PLAIN,false,round); // [checks round, too]
 //-- return this.dodivide('D',rhs,set,-1); // take scale from LHS
 //-- }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic and a
  * given scale and rounding mode.
  * <p>
  * The same as {@link #divide(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * <code>new _oui_bd_(0, _oui_bd_.PLAIN, false, round)</code>,
  * except that the length of the decimal part (the scale) to be used
  * for the result is explicit rather than being taken from
  * <code>this</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the same as the scale of the current object, if the latter were
  * formatted without exponential notation.
  * <p>
  * @param  rhs   The <code>_oui_bd</code> for the right hand side of
  *               the division.
  * @param  scale The <code>int</code> scale to be used for the result.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link _oui_bd_} class).
  * @return       A plain <code>_oui_bd</code> whose value is
  *               <code>this/rhs</code>, using fixed point arithmetic
  *               and the specified rounding mode.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if <code>round</code> is {@link
  *               _oui_bd_#ROUND_UNNECESSARY} and <code>scale</code>
  *               is insufficient to represent the result exactly.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divide(com.ibm.icu.math._oui_bd rhs,int scale,int round){
 //-- com.ibm.icu.math._oui_bd_ set;
 //-- if (scale<0)
 //--  throw new java.lang.ArithmeticException("Negative scale:"+" "+scale);
 //-- set=new com.ibm.icu.math._oui_bd_(0,com.ibm.icu.math._oui_bd_.PLAIN,false,round); // [checks round]
 //-- return this.dodivide('D',rhs,set,scale);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>this/rhs</code>.
  * <p>
  * Implements the division (<b><code>/</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the division.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divide(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function divide() {
  var set;
  var scale = -1;
  if (divide.arguments.length == 2)
   {
    if (typeof divide.arguments[1] == 'number')
     {
      set=new _oui_bd_(0,_oui_bd_.prototype.PLAIN,false,divide.arguments[1]); // [checks round, too]
     }
    else
     {
      set = divide.arguments[1];
     }
   }
  else if (divide.arguments.length == 3)
   {
    scale = divide.arguments[1];
    if (scale<0)
     throw "divide(): Negative scale: "+scale;
    set=new _oui_bd_(0,_oui_bd_.prototype.PLAIN,false,divide.arguments[2]); // [checks round]
   }
  else if (divide.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "divide(): " + divide.arguments.length + " arguments given; expected between 1 and 3";
   }
  var rhs = divide.arguments[0];
  return this.dodivide('D',rhs,set,scale);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is the integer
  * part of <code>this/rhs</code>.
  * <p>
  * The same as {@link #divideInteger(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the integer division.
  * @return     A <code>_oui_bd</code> whose value is the integer
  *             part of <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divideInteger(com.ibm.icu.math._oui_bd rhs){
 //-- // scale 0 to drop .000 when plain
 //-- return this.dodivide('I',rhs,plainMC,0);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is the integer
  * part of <code>this/rhs</code>.
  * <p>
  * Implements the integer division operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the integer division.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is the integer
  *             part of <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if the result will not fit in the
  *             number of digits specified for the context.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd divideInteger(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function divideInteger() {
  var set;
  if (divideInteger.arguments.length == 2)
   {
    set = divideInteger.arguments[1];
   }
  else if (divideInteger.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "divideInteger(): " + divideInteger.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = divideInteger.arguments[0];
  // scale 0 to drop .000 when plain
  return this.dodivide('I',rhs,set,0);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * the maximum of <code>this</code> and <code>rhs</code>.
  * <p>
  * The same as {@link #max(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @return     A <code>_oui_bd</code> whose value is
  *             the maximum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd max(com.ibm.icu.math._oui_bd rhs){
 //-- return this.max(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is
  * the maximum of <code>this</code> and <code>rhs</code>.
  * <p>
  * Returns the larger of the current object and the first parameter.
  * <p>
  * If calling the {@link #compareTo(_oui_bd, _oui_bd_)} method
  * with the same parameters would return <code>1</code> or
  * <code>0</code>, then the result of calling the
  * {@link #plus(_oui_bd_)} method on the current object (using the
  * same <code>_oui_bd_</code> parameter) is returned.
  * Otherwise, the result of calling the {@link #plus(_oui_bd_)}
  * method on the first parameter object (using the same
  * <code>_oui_bd_</code> parameter) is returned.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             the maximum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd max(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function max() {
  var set;
  if (max.arguments.length == 2)
   {
    set = max.arguments[1];
   }
  else if (max.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "max(): " + max.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = max.arguments[0];
  if ((this.compareTo(rhs,set))>=0)
   return this.plus(set);
  else
   return rhs.plus(set);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * the minimum of <code>this</code> and <code>rhs</code>.
  * <p>
  * The same as {@link #min(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @return     A <code>_oui_bd</code> whose value is
  *             the minimum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd min(com.ibm.icu.math._oui_bd rhs){
 //-- return this.min(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is
  * the minimum of <code>this</code> and <code>rhs</code>.
  * <p>
  * Returns the smaller of the current object and the first parameter.
  * <p>
  * If calling the {@link #compareTo(_oui_bd, _oui_bd_)} method
  * with the same parameters would return <code>-1</code> or
  * <code>0</code>, then the result of calling the
  * {@link #plus(_oui_bd_)} method on the current object (using the
  * same <code>_oui_bd_</code> parameter) is returned.
  * Otherwise, the result of calling the {@link #plus(_oui_bd_)}
  * method on the first parameter object (using the same
  * <code>_oui_bd_</code> parameter) is returned.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             the minimum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd min(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function min() {
  var set;
  if (min.arguments.length == 2)
   {
    set = min.arguments[1];
   }
  else if (min.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "min(): " + min.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = min.arguments[0];
  if ((this.compareTo(rhs,set))<=0)
   return this.plus(set);
  else
   return rhs.plus(set);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this*rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #add(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the sum of the scales of the operands, if they were formatted
  * without exponential notation.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the multiplication.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this*rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd multiply(com.ibm.icu.math._oui_bd rhs){
 //-- return this.multiply(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>this*rhs</code>.
  * <p>
  * Implements the multiplication (<b><code>*</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the multiplication.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this*rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd multiply(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function multiply() {
  var set;
  if (multiply.arguments.length == 2)
   {
    set = multiply.arguments[1];
   }
  else if (multiply.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "multiply(): " + multiply.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = multiply.arguments[0];
  //--com.ibm.icu.math._oui_bd lhs;
  var lhs;
  //--int padding;
  var padding;
  //--int reqdig;
  var reqdig;
  //--byte multer[]=null;
  var multer=null;
  //--byte multand[]=null;
  var multand=null;
  //--int multandlen;
  var multandlen;
  //--int acclen=0;
  var acclen=0;
  //--com.ibm.icu.math._oui_bd res;
  var res;
  //--byte acc[];
  var acc;
  //--int n=0;
  var n=0;
  //--byte mult=0;
  var mult=0;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity and proxy

  /* Prepare numbers (truncate, unless unlimited precision) */
  padding=0; // trailing 0's to add
  reqdig=set.digits; // local copy
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   // [we could reuse the new LHS for result in this case]
   }
  else
   {/* unlimited */
    // fixed point arithmetic will want every trailing 0; we add these
    // after the calculation rather than before, for speed.
    if (lhs.exp>0)
     padding=padding+lhs.exp;
    if (rhs.exp>0)
     padding=padding+rhs.exp;
   }

  // For best speed, as in DMSRCN, we use the shorter number as the
  // multiplier and the longer as the multiplicand.
  // 1999.12.22: We used to special case when the result would fit in
  //             a long, but with Java 1.3 this gave no advantage.
  if (lhs.mant.length<rhs.mant.length)
   {
    multer=lhs.mant;
    multand=rhs.mant;
   }
  else
   {
    multer=rhs.mant;
    multand=lhs.mant;
   }

  /* Calculate how long result byte array will be */
  multandlen=(multer.length+multand.length)-1; // effective length
  // optimize for 75% of the cases where a carry is expected...
  if ((multer[0]*multand[0])>9)
   acclen=multandlen+1;
  else
   acclen=multandlen;

  /* Now the main long multiplication loop */
  res=new _oui_bd(); // where we'll build result
  acc=this.createArrayWithZeros(acclen); // accumulator, all zeros
  // 1998.07.01: calculate from left to right so that accumulator goes
  // to likely final length on first addition; this avoids a one-digit
  // extension (and object allocation) each time around the loop.
  // Initial number therefore has virtual zeros added to right.
  {var $7=multer.length;n=0;n:for(;$7>0;$7--,n++){
   mult=multer[n];
   if (mult!=0)
    { // [optimization]
     // accumulate [accumulator is reusable array]
     acc=this.byteaddsub(acc,acc.length,multand,multandlen,mult,true);
    }
   // divide multiplicand by 10 for next digit to right
   multandlen--; // 'virtual length'
   }
  }/*n*/

  res.ind=lhs.ind*rhs.ind; // final sign
  res.exp=(lhs.exp+rhs.exp)-padding; // final exponent
  // [overflow is checked by finish]

  /* add trailing zeros to the result, if necessary */
  if (padding==0)
   res.mant=acc;
  else
   res.mant=this.extend(acc,acc.length+padding); // add trailing 0s
  return res.finish(set,false);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>-this</code>.
  * <p>
  * The same as {@link #negate(_oui_bd_)}, where the context is
  * <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * be <code>this.scale()</code>
  *
  *
  * @return A <code>_oui_bd</code> whose value is
  *         <code>-this</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd negate(){
 //-- return this.negate(plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>-this</code>.
  * <p>
  * Implements the negation (Prefix <b><code>-</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return A <code>_oui_bd</code> whose value is
  *         <code>-this</code>.
  * @stable ICU 2.0
  */

 //public com.ibm.icu.math._oui_bd negate(com.ibm.icu.math._oui_bd_ set){
 function negate() {
  var set;
  if (negate.arguments.length == 1)
   {
    set = negate.arguments[0];
   }
  else if (negate.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "negate(): " + negate.arguments.length + " arguments given; expected 0 or 1";
   }
  //--com.ibm.icu.math._oui_bd res;
  var res;
  // Originally called minus(), changed to matched Java precedents
  // This simply clones, flips the sign, and possibly rounds
  if (set.lostDigits)
   this.checkdigits(null,set.digits);
  res=this.clone(this); // safe copy
  res.ind=-res.ind;
  return res.finish(set,false);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>+this</code>.
  * Note that <code>this</code> is not necessarily a
  * plain <code>_oui_bd</code>, but the result will always be.
  * <p>
  * The same as {@link #plus(_oui_bd_)}, where the context is
  * <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * be <code>this.scale()</code>
  *
  * @return A <code>_oui_bd</code> whose value is
  *         <code>+this</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd plus(){
 //-- return this.plus(plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is
  * <code>+this</code>.
  * <p>
  * Implements the plus (Prefix <b><code>+</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  * <p>
  * This method is useful for rounding or otherwise applying a context
  * to a decimal value.
  *
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return A <code>_oui_bd</code> whose value is
  *         <code>+this</code>.
  * @stable ICU 2.0
  */

 //public com.ibm.icu.math._oui_bd plus(com.ibm.icu.math._oui_bd_ set){
 function plus() {
  var set;
  if (plus.arguments.length == 1)
   {
    set = plus.arguments[0];
   }
  else if (plus.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "plus(): " + plus.arguments.length + " arguments given; expected 0 or 1";
   }
  // This clones and forces the result to the new settings
  // May return same object
  if (set.lostDigits)
   this.checkdigits(null,set.digits);
  // Optimization: returns same object for some common cases
  if (set.form==_oui_bd_.prototype.PLAIN)
   if (this.form==_oui_bd_.prototype.PLAIN)
    {
     if (this.mant.length<=set.digits)
      return this;
     if (set.digits==0)
      return this;
    }
  return this.clone(this).finish(set,false);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this**rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #pow(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The parameter is the power to which the <code>this</code> will be
  * raised; it must be in the range 0 through 999999999, and must
  * have a decimal part of zero.  Note that these restrictions may be
  * removed in the future, so they should not be used as a test for a
  * whole number.
  * <p>
  * In addition, the power must not be negative, as no
  * <code>_oui_bd_</code> is used and so the result would then
  * always be 0.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the operation (the power).
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this**rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is out of range or
  *             is not a whole number.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd pow(com.ibm.icu.math._oui_bd rhs){
 //-- return this.pow(rhs,plainMC);
 //-- }
 // The name for this method is inherited from the precedent set by the
 // BigInteger and Math classes.

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>this**rhs</code>.
  * <p>
  * Implements the power (<b><code>**</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  * <p>
  * The first parameter is the power to which the <code>this</code>
  * will be raised; it must be in the range -999999999 through
  * 999999999, and must have a decimal part of zero.  Note that these
  * restrictions may be removed in the future, so they should not be
  * used as a test for a whole number.
  * <p>
  * If the <code>digits</code> setting of the <code>_oui_bd_</code>
  * parameter is 0, the power must be zero or positive.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the operation (the power).
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this**rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is out of range or
  *             is not a whole number.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd pow(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function pow() {
  var set;
  if (pow.arguments.length == 2)
   {
    set = pow.arguments[1];
   }
  else if (pow.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "pow(): " + pow.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = pow.arguments[0];
  //--int n;
  var n;
  //--com.ibm.icu.math._oui_bd lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //-- int workdigits=0;
  var workdigits=0;
  //--int L=0;
  var L=0;
  //--com.ibm.icu.math._oui_bd_ workset;
  var workset;
  //--com.ibm.icu.math._oui_bd res;
  var res;
  //--boolean seenbit;
  var seenbit;
  //--int i=0;
  var i=0;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  n=rhs.intcheck(this.MinArg,this.MaxArg); // check RHS by the rules
  lhs=this; // clarified name

  reqdig=set.digits; // local copy (heavily used)
  if (reqdig==0)
   {
    if (rhs.ind==this.isneg)
     //--throw new java.lang.ArithmeticException("Negative power:"+" "+rhs.toString());
     throw "pow(): Negative power: " + rhs.toString();
    workdigits=0;
   }
  else
   {/* non-0 digits */
    if ((rhs.mant.length+rhs.exp)>reqdig)
     //--throw new java.lang.ArithmeticException("Too many digits:"+" "+rhs.toString());
     throw "pow(): Too many digits: " + rhs.toString();

    /* Round the lhs to DIGITS if need be */
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);

    /* L for precision calculation [see ANSI X3.274-1996] */
    L=rhs.mant.length+rhs.exp; // length without decimal zeros/exp
    workdigits=(reqdig+L)+1; // calculate the working DIGITS
   }

  /* Create a copy of set for working settings */
  // Note: no need to check for lostDigits again.
  // 1999.07.17 Note: this construction must follow RHS check
  workset=new _oui_bd_(workdigits,set.form,false,set.roundingMode);

  res=this.ONE; // accumulator
  if (n==0)
   return res; // x**0 == 1
  if (n<0)
   n=-n; // [rhs.ind records the sign]
  seenbit=false; // set once we've seen a 1-bit
  {i=1;i:for(;;i++){ // for each bit [top bit ignored]
   //n=n+n; // shift left 1 bit
   n<<=1;
   if (n<0)
    { // top bit is set
     seenbit=true; // OK, we're off
     res=res.multiply(lhs,workset); // acc=acc*x
    }
   if (i==31)
    break i; // that was the last bit
   if ((!seenbit))
    continue i; // we don't have to square 1
   res=res.multiply(res,workset); // acc=acc*acc [square]
   }
  }/*i*/ // 32 bits
  if (rhs.ind<0)  // was a **-n [hence digits>0]
   res=this.ONE.divide(res,workset); // .. so acc=1/acc
  return res.finish(set,true); // round and strip [original digits]
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * the remainder of <code>this/rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #remainder(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * This is not the modulo operator -- the result may be negative.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the remainder operation.
  * @return     A <code>_oui_bd</code> whose value is the remainder
  *             of <code>this/rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd remainder(com.ibm.icu.math._oui_bd rhs){
 //-- return this.dodivide('R',rhs,plainMC,-1);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is the remainder of
  * <code>this/rhs</code>.
  * <p>
  * Implements the remainder operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  * <p>
  * This is not the modulo operator -- the result may be negative.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the remainder operation.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is the remainder
  *             of <code>this+rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if the integer part of the result will
  *             not fit in the number of digits specified for the
  *             context.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd remainder(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function remainder() {
  var set;
  if (remainder.arguments.length == 2)
   {
    set = remainder.arguments[1];
   }
  else if (remainder.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "remainder(): " + remainder.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = remainder.arguments[0];
  return this.dodivide('R',rhs,set,-1);
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose value is
  * <code>this-rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #subtract(_oui_bd, _oui_bd_)},
  * where the <code>_oui_bd</code> is <code>rhs</code>,
  * and the context is <code>new _oui_bd_(0, _oui_bd_.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the maximum of the scales of the two operands.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the subtraction.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this-rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd subtract(com.ibm.icu.math._oui_bd rhs){
 //-- return this.subtract(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>_oui_bd</code> whose value is <code>this-rhs</code>.
  * <p>
  * Implements the subtraction (<b><code>-</code></b>) operator
  * (as defined in the decimal documentation, see {@link _oui_bd
  * class header}),
  * and returns the result as a <code>_oui_bd</code> object.
  *
  * @param  rhs The <code>_oui_bd</code> for the right hand side of
  *             the subtraction.
  * @param  set The <code>_oui_bd_</code> arithmetic settings.
  * @return     A <code>_oui_bd</code> whose value is
  *             <code>this-rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd subtract(com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set){
 function subtract() {
  var set;
  if (subtract.arguments.length == 2)
   {
    set = subtract.arguments[1];
   }
  else if (subtract.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "subtract(): " + subtract.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = subtract.arguments[0];
  //--com.ibm.icu.math._oui_bd newrhs;
  var newrhs;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  // [add will recheck .. but would report -rhs]
  /* carry out the subtraction */
  // we could fastpath -0, but it is too rare.
  newrhs=this.clone(rhs); // safe copy
  newrhs.ind=-newrhs.ind; // prepare to subtract
  return this.add(newrhs,set); // arithmetic
  }

 /* ---------------------------------------------------------------- */
 /* Other methods                                                    */
 /* ---------------------------------------------------------------- */

 /**
  * Converts this <code>_oui_bd</code> to a <code>byte</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part or is
  * out of the possible range for a <code>byte</code> (8-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>byte</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a <code>byte</code>.
  * @stable ICU 2.0
  */

 //--public byte byteValueExact(){
 //-- int num;
 //-- num=this.intValueExact(); // will check decimal part too
 //-- if ((num>127)|(num<(-128)))
 //--  throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //-- return (byte)num;
 //-- }

 /**
  * Compares this <code>_oui_bd</code> with the value of the parameter.
  * <p>
  * If the parameter is <code>null</code>, or is not an instance of the
  * <code>_oui_bd</code> type, an exception is thrown.
  * Otherwise, the parameter is cast to type <code>_oui_bd</code>
  * and the result of the {@link #compareTo(_oui_bd)} method,
  * using the cast parameter, is returned.
  * <p>
  * The {@link #compareTo(_oui_bd, _oui_bd_)} method should be
  * used when a <code>_oui_bd_</code> is needed for the comparison.
  *
  * @param  rhs The <code>Object</code> for the right hand side of
  *             the comparison.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @throws ClassCastException if <code>rhs</code> cannot be cast to
  *                 a <code>_oui_bd</code> object.
  * @see    #compareTo(_oui_bd)
  * @stable ICU 2.0
  */

 //--public int compareTo(java.lang.Object rhsobj){
 //-- // the cast in the next line will raise ClassCastException if necessary
 //-- return compareTo((com.ibm.icu.math._oui_bd)rhsobj,plainMC);
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to a <code>double</code>.
  * If the <code>_oui_bd</code> is out of the possible range for a
  * <code>double</code> (64-bit signed floating point) result then an
  * <code>ArithmeticException</code> is thrown.
  * <p>
  * The double produced is identical to result of expressing the
  * <code>_oui_bd</code> as a <code>String</code> and then
  * converting it using the <code>Double(String)</code> constructor;
  * this can result in values of <code>Double.NEGATIVE_INFINITY</code>
  * or <code>Double.POSITIVE_INFINITY</code>.
  *
  * @return A <code>double</code> corresponding to <code>this</code>.
  * @stable ICU 2.0
  */

 //--public double doubleValue(){
 //-- // We go via a String [as does _oui_bd in JDK 1.2]
 //-- // Next line could possibly raise NumberFormatException
 //-- return java.lang.Double.valueOf(this.toString()).doubleValue();
 //-- }

 /**
  * Compares this <code>_oui_bd</code> with <code>rhs</code> for
  * equality.
  * <p>
  * If the parameter is <code>null</code>, or is not an instance of the
  * _oui_bd type, or is not exactly equal to the current
  * <code>_oui_bd</code> object, then <i>false</i> is returned.
  * Otherwise, <i>true</i> is returned.
  * <p>
  * "Exactly equal", here, means that the <code>String</code>
  * representations of the <code>_oui_bd</code> numbers are
  * identical (they have the same characters in the same sequence).
  * <p>
  * The {@link #compareTo(_oui_bd, _oui_bd_)} method should be
  * used for more general comparisons.
  * @param  rhs The <code>Object</code> for the right hand side of
  *             the comparison.
  * @return     A <code>boolean</code> whose value <i>true</i> if and
  *             only if the operands have identical string representations.
  * @throws ClassCastException if <code>rhs</code> cannot be cast to
  *                 a <code>_oui_bd</code> object.
  * @stable ICU 2.0
  * @see    #compareTo(Object)
  * @see    #compareTo(_oui_bd)
  * @see    #compareTo(_oui_bd, _oui_bd_)
  */

 //--public boolean equals(java.lang.Object obj){
 function equals(obj) {
  //--com.ibm.icu.math._oui_bd rhs;
  var rhs;
  //--int i=0;
  var i=0;
  //--char lca[]=null;
  var lca=null;
  //--char rca[]=null;
  var rca=null;
  // We are equal iff toString of both are exactly the same
  if (obj==null)
   return false; // not equal
  if ((!(((obj instanceof _oui_bd)))))
   return false; // not a decimal
  rhs=obj; // cast; we know it will work
  if (this.ind!=rhs.ind)
   return false; // different signs never match
  if (((this.mant.length==rhs.mant.length)&&(this.exp==rhs.exp))&&(this.form==rhs.form))

   { // mantissas say all
    // here with equal-length byte arrays to compare
    {var $8=this.mant.length;i=0;i:for(;$8>0;$8--,i++){
     if (this.mant[i]!=rhs.mant[i])
      return false;
     }
    }/*i*/
   }
  else
   { // need proper layout
    lca=this.layout(); // layout to character array
    rca=rhs.layout();
    if (lca.length!=rca.length)
     return false; // mismatch
    // here with equal-length character arrays to compare
    {var $9=lca.length;i=0;i:for(;$9>0;$9--,i++){
     if (lca[i]!=rca[i])
      return false;
     }
    }/*i*/
   }
  return true; // arrays have identical content
  }

 /**
  * Converts this <code>_oui_bd</code> to a <code>float</code>.
  * If the <code>_oui_bd</code> is out of the possible range for a
  * <code>float</code> (32-bit signed floating point) result then an
  * <code>ArithmeticException</code> is thrown.
  * <p>
  * The float produced is identical to result of expressing the
  * <code>_oui_bd</code> as a <code>String</code> and then
  * converting it using the <code>Float(String)</code> constructor;
  * this can result in values of <code>Float.NEGATIVE_INFINITY</code>
  * or <code>Float.POSITIVE_INFINITY</code>.
  *
  * @return A <code>float</code> corresponding to <code>this</code>.
  * @stable ICU 2.0
  */

 //--public float floatValue(){
 //-- return java.lang.Float.valueOf(this.toString()).floatValue();
 //-- }

 /**
  * Returns the <code>String</code> representation of this
  * <code>_oui_bd</code>, modified by layout parameters.
  * <p>
  * <i>This method is provided as a primitive for use by more
  * sophisticated classes, such as <code>DecimalFormat</code>, that
  * can apply locale-sensitive editing of the result.  The level of
  * formatting that it provides is a necessary part of the _oui_bd
  * class as it is sensitive to and must follow the calculation and
  * rounding rules for _oui_bd arithmetic.
  * However, if the function is provided elsewhere, it may be removed
  * from this class. </i>
  * <p>
  * The parameters, for both forms of the <code>format</code> method
  * are all of type <code>int</code>.
  * A value of -1 for any parameter indicates that the default action
  * or value for that parameter should be used.
  * <p>
  * The parameters, <code>before</code> and <code>after</code>,
  * specify the number of characters to be used for the integer part
  * and decimal part of the result respectively.  Exponential notation
  * is not used. If either parameter is -1 (which indicates the default
  * action), the number of characters used will be exactly as many as
  * are needed for that part.
  * <p>
  * <code>before</code> must be a positive number; if it is larger than
  * is needed to contain the integer part, that part is padded on the
  * left with blanks to the requested length. If <code>before</code> is
  * not large enough to contain the integer part of the number
  * (including the sign, for negative numbers) an exception is thrown.
  * <p>
  * <code>after</code> must be a non-negative number; if it is not the
  * same size as the decimal part of the number, the number will be
  * rounded (or extended with zeros) to fit.  Specifying 0 for
  * <code>after</code> will cause the number to be rounded to an
  * integer (that is, it will have no decimal part or decimal point).
  * The rounding method will be the default,
  * <code>_oui_bd_.ROUND_HALF_UP</code>.
  * <p>
  * Other rounding methods, and the use of exponential notation, can
  * be selected by using {@link #format(int,int,int,int,int,int)}.
  * Using the two-parameter form of the method has exactly the same
  * effect as using the six-parameter form with the final four
  * parameters all being -1.
  *
  * @param  before The <code>int</code> specifying the number of places
  *                before the decimal point.  Use -1 for 'as many as
  *                are needed'.
  * @param  after  The <code>int</code> specifying the number of places
  *                after the decimal point.  Use -1 for 'as many as are
  *                needed'.
  * @return        A <code>String</code> representing this
  *                <code>_oui_bd</code>, laid out according to the
  *                specified parameters
  * @throws ArithmeticException if the number cannot be laid out as
  *                requested.
  * @throws IllegalArgumentException if a parameter is out of range.
  * @stable ICU 2.0
  * @see    #toString
  * @see    #toCharArray
  */

 //--public java.lang.String format(int before,int after){
 //-- return format(before,after,-1,-1,com.ibm.icu.math._oui_bd_.SCIENTIFIC,ROUND_HALF_UP);
 //-- }

 /**
  * Returns the <code>String</code> representation of this
  * <code>_oui_bd</code>, modified by layout parameters and allowing
  * exponential notation.
  * <p>
  * <i>This method is provided as a primitive for use by more
  * sophisticated classes, such as <code>DecimalFormat</code>, that
  * can apply locale-sensitive editing of the result.  The level of
  * formatting that it provides is a necessary part of the _oui_bd
  * class as it is sensitive to and must follow the calculation and
  * rounding rules for _oui_bd arithmetic.
  * However, if the function is provided elsewhere, it may be removed
  * from this class. </i>
  * <p>
  * The parameters are all of type <code>int</code>.
  * A value of -1 for any parameter indicates that the default action
  * or value for that parameter should be used.
  * <p>
  * The first two parameters (<code>before</code> and
  * <code>after</code>) specify the number of characters to be used for
  * the integer part and decimal part of the result respectively, as
  * defined for {@link #format(int,int)}.
  * If either of these is -1 (which indicates the default action), the
  * number of characters used will be exactly as many as are needed for
  * that part.
  * <p>
  * The remaining parameters control the use of exponential notation
  * and rounding.  Three (<code>explaces</code>, <code>exdigits</code>,
  * and <code>exform</code>) control the exponent part of the result.
  * As before, the default action for any of these parameters may be
  * selected by using the value -1.
  * <p>
  * <code>explaces</code> must be a positive number; it sets the number
  * of places (digits after the sign of the exponent) to be used for
  * any exponent part, the default (when <code>explaces</code> is -1)
  * being to use as many as are needed.
  * If <code>explaces</code> is not -1, space is always reserved for
  * an exponent; if one is not needed (for example, if the exponent
  * will be 0) then <code>explaces</code>+2 blanks are appended to the
  * result.
  * <!-- (This preserves vertical alignment of similarly formatted
  *       numbers in a monospace font.) -->
  * If <code>explaces</code> is not -1 and is not large enough to
  * contain the exponent, an exception is thrown.
  * <p>
  * <code>exdigits</code> sets the trigger point for use of exponential
  * notation. If, before any rounding, the number of places needed
  * before the decimal point exceeds <code>exdigits</code>, or if the
  * absolute value of the result is less than <code>0.000001</code>,
  * then exponential form will be used, provided that
  * <code>exdigits</code> was specified.
  * When <code>exdigits</code> is -1, exponential notation will never
  * be used. If 0 is specified for <code>exdigits</code>, exponential
  * notation is always used unless the exponent would be 0.
  * <p>
  * <code>exform</code> sets the form for exponential notation (if
  * needed).
  * It  may be either {@link _oui_bd_#SCIENTIFIC} or
  * {@link _oui_bd_#ENGINEERING}.
  * If the latter, engineering, form is requested, up to three digits
  * (plus sign, if negative) may be needed for the integer part of the
  * result (<code>before</code>).  Otherwise, only one digit (plus
  * sign, if negative) is needed.
  * <p>
  * Finally, the sixth argument, <code>exround</code>, selects the
  * rounding algorithm to be used, and must be one of the values
  * indicated by a public constant in the {@link _oui_bd_} class
  * whose name starts with <code>ROUND_</code>.
  * The default (<code>ROUND_HALF_UP</code>) may also be selected by
  * using the value -1, as before.
  * <p>
  * The special value <code>_oui_bd_.ROUND_UNNECESSARY</code> may be
  * used to detect whether non-zero digits are discarded -- if
  * <code>exround</code> has this value than if non-zero digits would
  * be discarded (rounded) during formatting then an
  * <code>ArithmeticException</code> is thrown.
  *
  * @param  before   The <code>int</code> specifying the number of places
  *                  before the decimal point.
  *                  Use -1 for 'as many as are needed'.
  * @param  after    The <code>int</code> specifying the number of places
  *                  after the decimal point.
  *                  Use -1 for 'as many as are needed'.
  * @param  explaces The <code>int</code> specifying the number of places
  *                  to be used for any exponent.
  *                  Use -1 for 'as many as are needed'.
  * @param  exdigits The <code>int</code> specifying the trigger
  *                  (digits before the decimal point) which if
  *                  exceeded causes exponential notation to be used.
  *                  Use 0 to force exponential notation.
  *                  Use -1 to force plain notation (no exponential
  *                  notation).
  * @param  exform   The <code>int</code> specifying the form of
  *                  exponential notation to be used
  *                  ({@link _oui_bd_#SCIENTIFIC} or
  *                  {@link _oui_bd_#ENGINEERING}).
  * @param  exround  The <code>int</code> specifying the rounding mode
  *                  to use.
  *                  Use -1 for the default, {@link _oui_bd_#ROUND_HALF_UP}.
  * @return          A <code>String</code> representing this
  *                  <code>_oui_bd</code>, laid out according to the
  *                  specified parameters
  * @throws ArithmeticException if the number cannot be laid out as
  *                  requested.
  * @throws IllegalArgumentException if a parameter is out of range.
  * @see    #toString
  * @see    #toCharArray
  * @stable ICU 2.0
  */

 //--public java.lang.String format(int before,int after,int explaces,int exdigits,int exformint,int exround){
 function format() {
  var explaces;
  var exdigits;
  var exformint;
  var exround;
  if (format.arguments.length == 6)
   {
    explaces = format.arguments[2];
    exdigits = format.arguments[3];
    exformint = format.arguments[4];
    exround = format.arguments[5];
   }
  else if (format.arguments.length == 2)
   {
    explaces = -1;
    exdigits = -1;
    exformint = _oui_bd_.prototype.SCIENTIFIC;
    exround = this.ROUND_HALF_UP;
   }
  else
   {
    throw "format(): " + format.arguments.length + " arguments given; expected 2 or 6";
   }
  var before = format.arguments[0];
  var after = format.arguments[1];
  //--com.ibm.icu.math._oui_bd num;
  var num;
  //--int mag=0;
  var mag=0;
  //--int thisafter=0;
  var thisafter=0;
  //--int lead=0;
  var lead=0;
  //--byte newmant[]=null;
  var newmant=null;
  //--int chop=0;
  var chop=0;
  //--int need=0;
  var need=0;
  //--int oldexp=0;
  var oldexp=0;
  //--char a[];
  var a;
  //--int p=0;
  var p=0;
  //--char newa[]=null;
  var newa=null;
  //--int i=0;
  var i=0;
  //--int places=0;
  var places=0;


  /* Check arguments */
  if ((before<(-1))||(before==0))
   this.badarg("format",1,before);
  if (after<(-1))
   this.badarg("format",2,after);
  if ((explaces<(-1))||(explaces==0))
   this.badarg("format",3,explaces);
  if (exdigits<(-1))
   this.badarg("format",4,exdigits);
  {/*select*/
  if (exformint==_oui_bd_.prototype.SCIENTIFIC)
   {}
  else if (exformint==_oui_bd_.prototype.ENGINEERING)
   {}
  else if (exformint==(-1))
   exformint=_oui_bd_.prototype.SCIENTIFIC;
   // note PLAIN isn't allowed
  else{
   this.badarg("format",5,exformint);
  }
  }
  // checking the rounding mode is done by trying to construct a
  // _oui_bd_ object with that mode; it will fail if bad
  if (exround!=this.ROUND_HALF_UP)
   {try{ // if non-default...
    if (exround==(-1))
     exround=this.ROUND_HALF_UP;
    else
     new _oui_bd_(9,_oui_bd_.prototype.SCIENTIFIC,false,exround);
   }
   catch ($10){
    this.badarg("format",6,exround);
   }}

  num=this.clone(this); // make private copy

  /* Here:
     num       is _oui_bd to format
     before    is places before point [>0]
     after     is places after point  [>=0]
     explaces  is exponent places     [>0]
     exdigits  is exponent digits     [>=0]
     exformint is exponent form       [one of two]
     exround   is rounding mode       [one of eight]
     'before' through 'exdigits' are -1 if not specified
  */

  /* determine form */
  {setform:do{/*select*/
  if (exdigits==(-1))
   num.form=_oui_bd_.prototype.PLAIN;
  else if (num.ind==this.iszero)
   num.form=_oui_bd_.prototype.PLAIN;
  else{
   // determine whether triggers
   mag=num.exp+num.mant.length;
   if (mag>exdigits)
    num.form=exformint;
   else
    if (mag<(-5))
     num.form=exformint;
    else
     num.form=_oui_bd_.prototype.PLAIN;
  }
  }while(false);}/*setform*/

  /* If 'after' was specified then we may need to adjust the
     mantissa.  This is a little tricky, as we must conform to the
     rules of exponential layout if necessary (e.g., we cannot end up
     with 10.0 if scientific). */
  if (after>=0)
   {setafter:for(;;){
    // calculate the current after-length
    {/*select*/
    if (num.form==_oui_bd_.prototype.PLAIN)
     thisafter=-num.exp; // has decimal part
    else if (num.form==_oui_bd_.prototype.SCIENTIFIC)
     thisafter=num.mant.length-1;
    else{ // engineering
     lead=(((num.exp+num.mant.length)-1))%3; // exponent to use
     if (lead<0)
      lead=3+lead; // negative exponent case
     lead++; // number of leading digits
     if (lead>=num.mant.length)
      thisafter=0;
     else
      thisafter=num.mant.length-lead;
    }
    }
    if (thisafter==after)
     break setafter; // we're in luck
    if (thisafter<after)
     { // need added trailing zeros
      // [thisafter can be negative]
      newmant=this.extend(num.mant,(num.mant.length+after)-thisafter);
      num.mant=newmant;
      num.exp=num.exp-((after-thisafter)); // adjust exponent
      if (num.exp<this.MinExp)
       throw "format(): Exponent Overflow: " + num.exp;
      break setafter;
     }
    // We have too many digits after the decimal point; this could
    // cause a carry, which could change the mantissa...
    // Watch out for implied leading zeros in PLAIN case
    chop=thisafter-after; // digits to lop [is >0]
    if (chop>num.mant.length)
     { // all digits go, no chance of carry
      // carry on with zero
      num.mant=this.ZERO.mant;
      num.ind=this.iszero;
      num.exp=0;
      continue setafter; // recheck: we may need trailing zeros
     }
    // we have a digit to inspect from existing mantissa
    // round the number as required
    need=num.mant.length-chop; // digits to end up with [may be 0]
    oldexp=num.exp; // save old exponent
    num.round(need,exround);
    // if the exponent grew by more than the digits we chopped, then
    // we must have had a carry, so will need to recheck the layout
    if ((num.exp-oldexp)==chop)
     break setafter; // number did not have carry
    // mantissa got extended .. so go around and check again
    }
   }/*setafter*/

  a=num.layout(); // lay out, with exponent if required, etc.

  /* Here we have laid-out number in 'a' */
  // now apply 'before' and 'explaces' as needed
  if (before>0)
   {
    // look for '.' or 'E'
    {var $11=a.length;p=0;p:for(;$11>0;$11--,p++){
     if (a[p]=='.')
      break p;
     if (a[p]=='E')
      break p;
     }
    }/*p*/
    // p is now offset of '.', 'E', or character after end of array
    // that is, the current length of before part
    if (p>before)
     this.badarg("format",1,before); // won't fit
    if (p<before)
     { // need leading blanks
      newa=new Array((a.length+before)-p);
      {var $12=before-p;i=0;i:for(;$12>0;$12--,i++){
       newa[i]=' ';
       }
      }/*i*/
      //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,i,a.length);
      this.arraycopy(a,0,newa,i,a.length);
      a=newa;
     }
   // [if p=before then it's just the right length]
   }

  if (explaces>0)
   {
    // look for 'E' [cannot be at offset 0]
    {var $13=a.length-1;p=a.length-1;p:for(;$13>0;$13--,p--){
     if (a[p]=='E')
      break p;
     }
    }/*p*/
    // p is now offset of 'E', or 0
    if (p==0)
     { // no E part; add trailing blanks
      newa=new Array((a.length+explaces)+2);
      //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,0,a.length);
      this.arraycopy(a,0,newa,0,a.length);
      {var $14=explaces+2;i=a.length;i:for(;$14>0;$14--,i++){
       newa[i]=' ';
       }
      }/*i*/
      a=newa;
     }
    else
     {/* found E */ // may need to insert zeros
      places=(a.length-p)-2; // number so far
      if (places>explaces)
       this.badarg("format",3,explaces);
      if (places<explaces)
       { // need to insert zeros
        newa=new Array((a.length+explaces)-places);
        //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,0,p+2); // through E and sign
        this.arraycopy(a,0,newa,0,p+2);
        {var $15=explaces-places;i=p+2;i:for(;$15>0;$15--,i++){
         newa[i]='0';
         }
        }/*i*/
        //--java.lang.System.arraycopy((java.lang.Object)a,p+2,(java.lang.Object)newa,i,places); // remainder of exponent
        this.arraycopy(a,p+2,newa,i,places);
        a=newa;
       }
     // [if places=explaces then it's just the right length]
     }
   }
  return a.join("");
  }

 /**
  * Returns the hashcode for this <code>_oui_bd</code>.
  * This hashcode is suitable for use by the
  * <code>java.util.Hashtable</code> class.
  * <p>
  * Note that two <code>_oui_bd</code> objects are only guaranteed
  * to produce the same hashcode if they are exactly equal (that is,
  * the <code>String</code> representations of the
  * <code>_oui_bd</code> numbers are identical -- they have the same
  * characters in the same sequence).
  *
  * @return An <code>int</code> that is the hashcode for <code>this</code>.
  * @stable ICU 2.0
  */

 //--public int hashCode(){
 //-- // Maybe calculate ouielves, later.  If so, note that there can be
 //-- // more than one internal representation for a given toString() result.
 //-- return this.toString().hashCode();
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to an <code>int</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part it is
  * discarded. If the <code>_oui_bd</code> is out of the possible
  * range for an <code>int</code> (32-bit signed integer) result then
  * only the low-order 32 bits are used. (That is, the number may be
  * <i>decapitated</i>.)  To avoid unexpected errors when these
  * conditions occur, use the {@link #intValueExact} method.
  *
  * @return An <code>int</code> converted from <code>this</code>,
  *         truncated and decapitated if necessary.
  * @stable ICU 2.0
  */

 //--public int intValue(){
 //-- return toBigInteger().intValue();
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to an <code>int</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part or is
  * out of the possible range for an <code>int</code> (32-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return An <code>int</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in an
  *                 <code>int</code>.
  * @stable ICU 2.0
  */

 //--public int intValueExact(){
 function intValueExact() {
  //--int lodigit;
  var lodigit;
  //--int useexp=0;
  var useexp=0;
  //--int result;
  var result;
  //--int i=0;
  var i=0;
  //--int topdig=0;
  var topdig=0;
  // This does not use longValueExact() as the latter can be much
  // slower.
  // intcheck (from pow) relies on this to check decimal part
  if (this.ind==this.iszero)
   return 0; // easy, and quite common
  /* test and drop any trailing decimal part */
  lodigit=this.mant.length-1;
  if (this.exp<0)
   {
    lodigit=lodigit+this.exp; // reduces by -(-exp)
    /* all decimal places must be 0 */
    if ((!(this.allzero(this.mant,lodigit+1))))
     throw "intValueExact(): Decimal part non-zero: " + this.toString();
    if (lodigit<0)
     return 0; // -1<this<1
    useexp=0;
   }
  else
   {/* >=0 */
    if ((this.exp+lodigit)>9)  // early exit
     throw "intValueExact(): Conversion overflow: "+this.toString();
    useexp=this.exp;
   }
  /* convert the mantissa to binary, inline for speed */
  result=0;
  {var $16=lodigit+useexp;i=0;i:for(;i<=$16;i++){
   result=result*10;
   if (i<=lodigit)
    result=result+this.mant[i];
   }
  }/*i*/

  /* Now, if the risky length, check for overflow */
  if ((lodigit+useexp)==9)
   {
    // note we cannot just test for -ve result, as overflow can move a
    // zero into the top bit [consider 5555555555]
    topdig=div(result,1000000000); // get top digit, preserving sign
    if (topdig!=this.mant[0])
     { // digit must match and be positive
      // except in the special case ...
      if (result==-2147483648)  // looks like the special
       if (this.ind==this.isneg)  // really was negative
        if (this.mant[0]==2)
         return result; // really had top digit 2
      throw "intValueExact(): Conversion overflow: "+this.toString();
     }
   }

  /* Looks good */
  if (this.ind==this.ispos)
   return result;
  return -result;
  }

 /**
  * Converts this <code>_oui_bd</code> to a <code>long</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part it is
  * discarded. If the <code>_oui_bd</code> is out of the possible
  * range for a <code>long</code> (64-bit signed integer) result then
  * only the low-order 64 bits are used. (That is, the number may be
  * <i>decapitated</i>.)  To avoid unexpected errors when these
  * conditions occur, use the {@link #longValueExact} method.
  *
  * @return A <code>long</code> converted from <code>this</code>,
  *         truncated and decapitated if necessary.
  * @stable ICU 2.0
  */

 //--public long longValue(){
 //-- return toBigInteger().longValue();
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to a <code>long</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part or is
  * out of the possible range for a <code>long</code> (64-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>long</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a
  *                 <code>long</code>.
  * @stable ICU 2.0
  */

 //--public long longValueExact(){
 //-- int lodigit;
 //-- int cstart=0;
 //-- int useexp=0;
 //-- long result;
 //-- int i=0;
 //-- long topdig=0;
 //-- // Identical to intValueExact except for result=long, and exp>=20 test
 //-- if (ind==0)
 //--  return 0; // easy, and quite common
 //-- lodigit=mant.length-1; // last included digit
 //-- if (exp<0)
 //--  {
 //--   lodigit=lodigit+exp; // -(-exp)
 //--   /* all decimal places must be 0 */
 //--   if (lodigit<0)
 //--    cstart=0;
 //--   else
 //--    cstart=lodigit+1;
 //--   if ((!(allzero(mant,cstart))))
 //--    throw new java.lang.ArithmeticException("Decimal part non-zero:"+" "+this.toString());
 //--   if (lodigit<0)
 //--    return 0; // -1<this<1
 //--   useexp=0;
 //--  }
 //-- else
 //--  {/* >=0 */
 //--   if ((exp+mant.length)>18)  // early exit
 //--    throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //--   useexp=exp;
 //--  }
 //--
 //-- /* convert the mantissa to binary, inline for speed */
 //-- // note that we could safely use the 'test for wrap to negative'
 //-- // algorithm here, but instead we parallel the intValueExact
 //-- // algorithm for ease of checking and maintenance.
 //-- result=(long)0;
 //-- {int $17=lodigit+useexp;i=0;i:for(;i<=$17;i++){
 //--  result=result*10;
 //--  if (i<=lodigit)
 //--   result=result+mant[i];
 //--  }
 //-- }/*i*/
 //--
 //-- /* Now, if the risky length, check for overflow */
 //-- if ((lodigit+useexp)==18)
 //--  {
 //--   topdig=result/1000000000000000000L; // get top digit, preserving sign
 //--   if (topdig!=mant[0])
 //--    { // digit must match and be positive
 //--     // except in the special case ...
 //--     if (result==java.lang.Long.MIN_VALUE)  // looks like the special
 //--      if (ind==isneg)  // really was negative
 //--       if (mant[0]==9)
 //--        return result; // really had top digit 9
 //--     throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //--    }
 //--  }
 //--
 //-- /* Looks good */
 //-- if (ind==ispos)
 //--  return result;
 //-- return (long)-result;
 //-- }

 /**
  * Returns a plain <code>_oui_bd</code> whose decimal point has
  * been moved to the left by a specified number of positions.
  * The parameter, <code>n</code>, specifies the number of positions to
  * move the decimal point.
  * That is, if <code>n</code> is 0 or positive, the number returned is
  * given by:
  * <p><code>
  * this.multiply(TEN.pow(new _oui_bd(-n)))
  * </code>
  * <p>
  * <code>n</code> may be negative, in which case the method returns
  * the same result as <code>movePointRight(-n)</code>.
  *
  * @param  n The <code>int</code> specifying the number of places to
  *           move the decimal point leftwards.
  * @return   A <code>_oui_bd</code> derived from
  *           <code>this</code>, with the decimal point moved
  *           <code>n</code> places to the left.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd movePointLeft(int n){
 function movePointLeft(n) {
  //--com.ibm.icu.math._oui_bd res;
  var res;
  // very little point in optimizing for shift of 0
  res=this.clone(this);
  res.exp=res.exp-n;
  return res.finish(this.plainMC,false); // finish sets form and checks exponent
  }

 /**
  * Returns a plain <code>_oui_bd</code> whose decimal point has
  * been moved to the right by a specified number of positions.
  * The parameter, <code>n</code>, specifies the number of positions to
  * move the decimal point.
  * That is, if <code>n</code> is 0 or positive, the number returned is
  * given by:
  * <p><code>
  * this.multiply(TEN.pow(new _oui_bd(n)))
  * </code>
  * <p>
  * <code>n</code> may be negative, in which case the method returns
  * the same result as <code>movePointLeft(-n)</code>.
  *
  * @param  n The <code>int</code> specifying the number of places to
  *           move the decimal point rightwards.
  * @return   A <code>_oui_bd</code> derived from
  *           <code>this</code>, with the decimal point moved
  *           <code>n</code> places to the right.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd movePointRight(int n){
 function movePointRight(n) {
  //--com.ibm.icu.math._oui_bd res;
  var res;
  res=this.clone(this);
  res.exp=res.exp+n;
  return res.finish(this.plainMC,false);
  }

 /**
  * Returns the scale of this <code>_oui_bd</code>.
  * Returns a non-negative <code>int</code> which is the scale of the
  * number. The scale is the number of digits in the decimal part of
  * the number if the number were formatted without exponential
  * notation.
  *
  * @return An <code>int</code> whose value is the scale of this
  *         <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public int scale(){
 function scale() {
  if (this.exp>=0)
   return 0; // scale can never be negative
  return -this.exp;
  }

 /**
  * Returns a plain <code>_oui_bd</code> with a given scale.
  * <p>
  * If the given scale (which must be zero or positive) is the same as
  * or greater than the length of the decimal part (the scale) of this
  * <code>_oui_bd</code> then trailing zeros will be added to the
  * decimal part as necessary.
  * <p>
  * If the given scale is less than the length of the decimal part (the
  * scale) of this <code>_oui_bd</code> then trailing digits
  * will be removed, and in this case an
  * <code>ArithmeticException</code> is thrown if any discarded digits
  * are non-zero.
  * <p>
  * The same as {@link #setScale(int, int)}, where the first parameter
  * is the scale, and the second is
  * <code>_oui_bd_.ROUND_UNNECESSARY</code>.
  *
  * @param  scale The <code>int</code> specifying the scale of the
  *               resulting <code>_oui_bd</code>.
  * @return       A plain <code>_oui_bd</code> with the given scale.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if reducing scale would discard
  *               non-zero digits.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd setScale(int scale){
 //-- return setScale(scale,ROUND_UNNECESSARY);
 //-- }

 /**
  * Returns a plain <code>_oui_bd</code> with a given scale.
  * <p>
  * If the given scale (which must be zero or positive) is the same as
  * or greater than the length of the decimal part (the scale) of this
  * <code>_oui_bd</code> then trailing zeros will be added to the
  * decimal part as necessary.
  * <p>
  * If the given scale is less than the length of the decimal part (the
  * scale) of this <code>_oui_bd</code> then trailing digits
  * will be removed, and the rounding mode given by the second
  * parameter is used to determine if the remaining digits are
  * affected by a carry.
  * In this case, an <code>IllegalArgumentException</code> is thrown if
  * <code>round</code> is not a valid rounding mode.
  * <p>
  * If <code>round</code> is <code>_oui_bd_.ROUND_UNNECESSARY</code>,
  * an <code>ArithmeticException</code> is thrown if any discarded
  * digits are non-zero.
  *
  * @param  scale The <code>int</code> specifying the scale of the
  *               resulting <code>_oui_bd</code>.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link _oui_bd_} class).
  * @return       A plain <code>_oui_bd</code> with the given scale.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if <code>round</code> is
  *               <code>_oui_bd_.ROUND_UNNECESSARY</code>, and
  *               reducing scale would discard non-zero digits.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math._oui_bd setScale(int scale,int round){
 function setScale() {
  var round;
  if (setScale.arguments.length == 2)
   {
    round = setScale.arguments[1];
   }
  else if (setScale.arguments.length == 1)
   {
    round = this.ROUND_UNNECESSARY;
   }
  else
   {
    throw "setScale(): " + setScale.arguments.length + " given; expected 1 or 2";
   }
  var scale = setScale.arguments[0];
  //--int ouicale;
  var ouicale;
  //--com.ibm.icu.math._oui_bd res;
  var res;
  //--int padding=0;
  var padding=0;
  //--int newlen=0;
  var newlen=0;
  // at present this naughtily only checks the round value if it is
  // needed (used), for speed
  ouicale=this.scale();
  if (ouicale==scale)  // already correct scale
   if (this.form==_oui_bd_.prototype.PLAIN)  // .. and form
    return this;
  res=this.clone(this); // need copy
  if (ouicale<=scale)
   { // simply zero-padding/changing form
    // if ouicale is 0 we may have lots of 0s to add
    if (ouicale==0)
     padding=res.exp+scale;
    else
     padding=scale-ouicale;
    res.mant=this.extend(res.mant,res.mant.length+padding);
    res.exp=-scale; // as requested
   }
  else
   {/* ouicale>scale: shortening, probably */
    if (scale<0)
     //--throw new java.lang.ArithmeticException("Negative scale:"+" "+scale);
     throw "setScale(): Negative scale: " + scale;
    // [round() will raise exception if invalid round]
    newlen=res.mant.length-((ouicale-scale)); // [<=0 is OK]
    res=res.round(newlen,round); // round to required length
    // This could have shifted left if round (say) 0.9->1[.0]
    // Repair if so by adding a zero and reducing exponent
    if (res.exp!=(-scale))
     {
      res.mant=this.extend(res.mant,res.mant.length+1);
      res.exp=res.exp-1;
     }
   }
  res.form=_oui_bd_.prototype.PLAIN; // by definition
  return res;
  }

 /**
  * Converts this <code>_oui_bd</code> to a <code>short</code>.
  * If the <code>_oui_bd</code> has a non-zero decimal part or is
  * out of the possible range for a <code>short</code> (16-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>short</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a
  *                 <code>short</code>.
  * @stable ICU 2.0
  */

 //--public short shortValueExact(){
 //-- int num;
 //-- num=this.intValueExact(); // will check decimal part too
 //-- if ((num>32767)|(num<(-32768)))
 //--  throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //-- return (short)num;
 //-- }

 /**
  * Returns the sign of this <code>_oui_bd</code>, as an
  * <code>int</code>.
  * This returns the <i>signum</i> function value that represents the
  * sign of this <code>_oui_bd</code>.
  * That is, -1 if the <code>_oui_bd</code> is negative, 0 if it is
  * numerically equal to zero, or 1 if it is positive.
  *
  * @return An <code>int</code> which is -1 if the
  *         <code>_oui_bd</code> is negative, 0 if it is
  *         numerically equal to zero, or 1 if it is positive.
  * @stable ICU 2.0
  */

 //--public int signum(){
 function signum() {
  return this.ind; // [note this assumes values for ind.]
  }

 /**
  * Converts this <code>_oui_bd</code> to a
  * <code>java.math._oui_bd</code>.
  * <p>
  * This is an exact conversion; the result is the same as if the
  * <code>_oui_bd</code> were formatted as a plain number without
  * any rounding or exponent and then the
  * <code>java.math._oui_bd(java.lang.String)</code> constructor
  * were used to construct the result.
  * <p>
  * <i>(Note: this method is provided only in the
  * <code>com.ibm.icu.math</code> version of the _oui_bd class.
  * It would not be present in a <code>java.math</code> version.)</i>
  *
  * @return The <code>java.math._oui_bd</code> equal in value
  *         to this <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public java.math._oui_bd to_oui_bd(){
 //-- return new java.math._oui_bd(this.unscaledValue(),this.scale());
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to a
  * <code>java.math.BigInteger</code>.
  * <p>
  * Any decimal part is truncated (discarded).
  * If an exception is desired should the decimal part be non-zero,
  * use {@link #toBigIntegerExact()}.
  *
  * @return The <code>java.math.BigInteger</code> equal in value
  *         to the integer part of this <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger toBigInteger(){
 //-- com.ibm.icu.math._oui_bd res=null;
 //-- int newlen=0;
 //-- byte newmant[]=null;
 //-- {/*select*/
 //-- if ((exp>=0)&(form==com.ibm.icu.math._oui_bd_.PLAIN))
 //--  res=this; // can layout simply
 //-- else if (exp>=0)
 //--  {
 //--   res=clone(this); // safe copy
 //--   res.form=(byte)com.ibm.icu.math._oui_bd_.PLAIN; // .. and request PLAIN
 //--  }
 //-- else{
 //--  { // exp<0; scale to be truncated
 //--   // we could use divideInteger, but we may as well be quicker
 //--   if (((int)-this.exp)>=this.mant.length)
 //--    res=ZERO; // all blows away
 //--   else
 //--    {
 //--     res=clone(this); // safe copy
 //--     newlen=res.mant.length+res.exp;
 //--     newmant=new byte[newlen]; // [shorter]
 //--     java.lang.System.arraycopy((java.lang.Object)res.mant,0,(java.lang.Object)newmant,0,newlen);
 //--     res.mant=newmant;
 //--     res.form=(byte)com.ibm.icu.math._oui_bd_.PLAIN;
 //--     res.exp=0;
 //--    }
 //--  }
 //-- }
 //-- }
 //-- return new BigInteger(new java.lang.String(res.layout()));
 //-- }

 /**
  * Converts this <code>_oui_bd</code> to a
  * <code>java.math.BigInteger</code>.
  * <p>
  * An exception is thrown if the decimal part (if any) is non-zero.
  *
  * @return The <code>java.math.BigInteger</code> equal in value
  *         to the integer part of this <code>_oui_bd</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *         decimal part.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger toBigIntegerExact(){
 //-- /* test any trailing decimal part */
 //-- if (exp<0)
 //--  { // possible decimal part
 //--   /* all decimal places must be 0; note exp<0 */
 //--   if ((!(allzero(mant,mant.length+exp))))
 //--    throw new java.lang.ArithmeticException("Decimal part non-zero:"+" "+this.toString());
 //--  }
 //-- return toBigInteger();
 //-- }

 /**
  * Returns the <code>_oui_bd</code> as a character array.
  * The result of this method is the same as using the
  * sequence <code>toString().toCharArray()</code>, but avoids creating
  * the intermediate <code>String</code> and <code>char[]</code>
  * objects.
  *
  * @return The <code>char[]</code> array corresponding to this
  *         <code>_oui_bd</code>.
  * @stable ICU 2.0
  */

 //--public char[] toCharArray(){
 //-- return layout();
 //-- }

 /**
  * Returns the <code>_oui_bd</code> as a <code>String</code>.
  * This returns a <code>String</code> that exactly represents this
  * <code>_oui_bd</code>, as defined in the decimal documentation
  * (see {@link _oui_bd class header}).
  * <p>
  * By definition, using the {@link #_oui_bd(String)} constructor
  * on the result <code>String</code> will create a
  * <code>_oui_bd</code> that is exactly equal to the original
  * <code>_oui_bd</code>.
  *
  * @return The <code>String</code> exactly corresponding to this
  *         <code>_oui_bd</code>.
  * @see    #format(int, int)
  * @see    #format(int, int, int, int, int, int)
  * @see    #toCharArray()
  * @stable ICU 2.0
  */

 //--public java.lang.String toString(){
 function toString() {
  return this.layout().join("");
  }

 /**
  * Returns the number as a <code>BigInteger</code> after removing the
  * scale.
  * That is, the number is expressed as a plain number, any decimal
  * point is then removed (retaining the digits of any decimal part),
  * and the result is then converted to a <code>BigInteger</code>.
  *
  * @return The <code>java.math.BigInteger</code> equal in value to
  *         this <code>_oui_bd</code> multiplied by ten to the
  *         power of <code>this.scale()</code>.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger unscaledValue(){
 //-- com.ibm.icu.math._oui_bd res=null;
 //-- if (exp>=0)
 //--  res=this;
 //-- else
 //--  {
 //--   res=clone(this); // safe copy
 //--   res.exp=0; // drop scale
 //--  }
 //-- return res.toBigInteger();
 //-- }

 /**
  * Translates a <code>double</code> to a <code>_oui_bd</code>.
  * <p>
  * Returns a <code>_oui_bd</code> which is the decimal
  * representation of the 64-bit signed binary floating point
  * parameter. If the parameter is infinite, or is not a number (NaN),
  * a <code>NumberFormatException</code> is thrown.
  * <p>
  * The number is constructed as though <code>num</code> had been
  * converted to a <code>String</code> using the
  * <code>Double.toString()</code> method and the
  * {@link #_oui_bd(java.lang.String)} constructor had then been used.
  * This is typically not an exact conversion.
  *
  * @param  dub The <code>double</code> to be translated.
  * @return     The <code>_oui_bd</code> equal in value to
  *             <code>dub</code>.
  * @throws NumberFormatException if the parameter is infinite or
  *             not a number.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math._oui_bd valueOf(double dub){
 //-- // Reminder: a zero double returns '0.0', so we cannot fastpath to
 //-- // use the constant ZERO.  This might be important enough to justify
 //-- // a factory approach, a cache, or a few private constants, later.
 //-- return new com.ibm.icu.math._oui_bd((new java.lang.Double(dub)).toString());
 //-- }

 /**
  * Translates a <code>long</code> to a <code>_oui_bd</code>.
  * That is, returns a plain <code>_oui_bd</code> whose value is
  * equal to the given <code>long</code>.
  *
  * @param  lint The <code>long</code> to be translated.
  * @return      The <code>_oui_bd</code> equal in value to
  *              <code>lint</code>.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math._oui_bd valueOf(long lint){
 //-- return valueOf(lint,0);
 //-- }

 /**
  * Translates a <code>long</code> to a <code>_oui_bd</code> with a
  * given scale.
  * That is, returns a plain <code>_oui_bd</code> whose unscaled
  * value is equal to the given <code>long</code>, adjusted by the
  * second parameter, <code>scale</code>.
  * <p>
  * The result is given by:
  * <p><code>
  * (new _oui_bd(lint)).divide(TEN.pow(new _oui_bd(scale)))
  * </code>
  * <p>
  * A <code>NumberFormatException</code> is thrown if <code>scale</code>
  * is negative.
  *
  * @param  lint  The <code>long</code> to be translated.
  * @param  scale The <code>int</code> scale to be applied.
  * @return       The <code>_oui_bd</code> equal in value to
  *               <code>lint</code>.
  * @throws NumberFormatException if the scale is negative.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math._oui_bd valueOf(long lint,int scale){
 //-- com.ibm.icu.math._oui_bd res=null;
 //-- {/*select*/
 //-- if (lint==0)
 //--  res=ZERO;
 //-- else if (lint==1)
 //--  res=ONE;
 //-- else if (lint==10)
 //--  res=TEN;
 //-- else{
 //--  res=new com.ibm.icu.math._oui_bd(lint);
 //-- }
 //-- }
 //-- if (scale==0)
 //--  return res;
 //-- if (scale<0)
 //--  throw new java.lang.NumberFormatException("Negative scale:"+" "+scale);
 //-- res=clone(res); // safe copy [do not mutate]
 //-- res.exp=(int)-scale; // exponent is -scale
 //-- return res;
 //-- }

 /* ---------------------------------------------------------------- */
 /* Private methods                                                  */
 /* ---------------------------------------------------------------- */

 /* <sgml> Return char array value of a _oui_bd (conversion from
       _oui_bd to laid-out canonical char array).
    <p>The mantissa will either already have been rounded (following an
       operation) or will be of length appropriate (in the case of
       construction from an int, for example).
    <p>We must not alter the mantissa, here.
    <p>'form' describes whether we are to use exponential notation (and
       if so, which), or if we are to lay out as a plain/pure numeric.
    </sgml> */

 //--private char[] layout(){
 function layout() {
  //--char cmant[];
  var cmant;
  //--int i=0;
  var i=0;
  //--java.lang.StringBuffer sb=null;
  var sb=null;
  //--int euse=0;
  var euse=0;
  //--int sig=0;
  var sig=0;
  //--char csign=0;
  var csign=0;
  //--char rec[]=null;
  var rec=null;
  //--int needsign;
  var needsign;
  //--int mag;
  var mag;
  //--int len=0;
  var len=0;
  cmant=new Array(this.mant.length); // copy byte[] to a char[]
  {var $18=this.mant.length;i=0;i:for(;$18>0;$18--,i++){
   cmant[i]=this.mant[i]+'';
   }
  }/*i*/

  if (this.form!=_oui_bd_.prototype.PLAIN)
   {/* exponential notation needed */
    //--sb=new java.lang.StringBuffer(cmant.length+15); // -x.xxxE+999999999
    sb="";
    if (this.ind==this.isneg)
     sb += '-';
    euse=(this.exp+cmant.length)-1; // exponent to use
    /* setup sig=significant digits and copy to result */
    if (this.form==_oui_bd_.prototype.SCIENTIFIC)
     { // [default]
      sb += cmant[0]; // significant character
      if (cmant.length>1)  // have decimal part
       //--sb.append('.').append(cmant,1,cmant.length-1);
       sb += '.';
       sb += cmant.slice(1).join("");
     }
    else
     {engineering:do{
      sig=euse%3; // common
      if (sig<0)
       sig=3+sig; // negative exponent
      euse=euse-sig;
      sig++;
      if (sig>=cmant.length)
       { // zero padding may be needed
        //--sb.append(cmant,0,cmant.length);
        sb += cmant.join("");
        {var $19=sig-cmant.length;for(;$19>0;$19--){
         sb += '0';
         }
        }
       }
      else
       { // decimal point needed
        //--sb.append(cmant,0,sig).append('.').append(cmant,sig,cmant.length-sig);
        sb += cmant.slice(0,sig).join("");
        sb += '.';
        sb += cmant.slice(sig).join("");
       }
     }while(false);}/*engineering*/
    if (euse!=0)
     {
      if (euse<0)
       {
        csign='-';
        euse=-euse;
       }
      else
       csign='+';
      //--sb.append('E').append(csign).append(euse);
      sb += 'E';
      sb += csign;
      sb += euse;
     }
    //--rec=new Array(sb.length);
    //--Utility.getChars(sb, 0,sb.length(),rec,0);
    //--return rec;
    return sb.split("");
   }

  /* Here for non-exponential (plain) notation */
  if (this.exp==0)
   {/* easy */
    if (this.ind>=0)
     return cmant; // non-negative integer
    rec=new Array(cmant.length+1);
    rec[0]='-';
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,1,cmant.length);
    this.arraycopy(cmant,0,rec,1,cmant.length);
    return rec;
   }

  /* Need a '.' and/or some zeros */
  needsign=((this.ind==this.isneg)?1:0); // space for sign?  0 or 1

  /* MAG is the position of the point in the mantissa (index of the
     character it follows) */
  mag=this.exp+cmant.length;

  if (mag<1)
   {/* 0.00xxxx form */
    len=(needsign+2)-this.exp; // needsign+2+(-mag)+cmant.length
    rec=new Array(len);
    if (needsign!=0)
     rec[0]='-';
    rec[needsign]='0';
    rec[needsign+1]='.';
    {var $20=-mag;i=needsign+2;i:for(;$20>0;$20--,i++){ // maybe none
     rec[i]='0';
     }
    }/*i*/
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,(needsign+2)-mag,cmant.length);
    this.arraycopy(cmant,0,rec,(needsign+2)-mag,cmant.length);
    return rec;
   }

  if (mag>cmant.length)
   {/* xxxx0000 form */
    len=needsign+mag;
    rec=new Array(len);
    if (needsign!=0)
     rec[0]='-';
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,needsign,cmant.length);
    this.arraycopy(cmant,0,rec,needsign,cmant.length);
    {var $21=mag-cmant.length;i=needsign+cmant.length;i:for(;$21>0;$21--,i++){ // never 0
     rec[i]='0';
     }
    }/*i*/
    return rec;
   }

  /* decimal point is in the middle of the mantissa */
  len=(needsign+1)+cmant.length;
  rec=new Array(len);
  if (needsign!=0)
   rec[0]='-';
  //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,needsign,mag);
  this.arraycopy(cmant,0,rec,needsign,mag);
  rec[needsign+mag]='.';
  //--java.lang.System.arraycopy((java.lang.Object)cmant,mag,(java.lang.Object)rec,(needsign+mag)+1,cmant.length-mag);
  this.arraycopy(cmant,mag,rec,(needsign+mag)+1,cmant.length-mag);
  return rec;
  }

 /* <sgml> Checks a _oui_bd argument to ensure it's a true integer
       in a given range.
    <p>If OK, returns it as an int. </sgml> */
 // [currently only used by pow]

 //--private int intcheck(int min,int max){
 function intcheck(min, max) {
  //--int i;
  var i;
  i=this.intValueExact(); // [checks for non-0 decimal part]
  // Use same message as though intValueExact failed due to size
  if ((i<min)||(i>max))
   throw "intcheck(): Conversion overflow: "+i;
  return i;
  }

 /* <sgml> Carry out division operations. </sgml> */
 /*
    Arg1 is operation code: D=divide, I=integer divide, R=remainder
    Arg2 is the rhs.
    Arg3 is the context.
    Arg4 is explicit scale iff code='D' or 'I' (-1 if none).

    Underlying algorithm (complications for Remainder function and
    scaled division are omitted for clarity):

      Test for x/0 and then 0/x
      Exp =Exp1 - Exp2
      Exp =Exp +len(var1) -len(var2)
      Sign=Sign1 * Sign2
      Pad accumulator (Var1) to double-length with 0's (pad1)
      Pad Var2 to same length as Var1
      B2B=1st two digits of var2, +1 to allow for roundup
      have=0
      Do until (have=digits+1 OR residue=0)
        if exp<0 then if integer divide/residue then leave
        this_digit=0
        Do forever
           compare numbers
           if <0 then leave inner_loop
           if =0 then (- quick exit without subtract -) do
              this_digit=this_digit+1; output this_digit
              leave outer_loop; end
           Compare lengths of numbers (mantissae):
           If same then CA=first_digit_of_Var1
                   else CA=first_two_digits_of_Var1
           mult=ca*10/b2b   -- Good and safe guess at divisor
           if mult=0 then mult=1
           this_digit=this_digit+mult
           subtract
           end inner_loop
         if have\=0 | this_digit\=0 then do
           output this_digit
           have=have+1; end
         var2=var2/10
         exp=exp-1
         end outer_loop
      exp=exp+1   -- set the proper exponent
      if have=0 then generate answer=0
      Return to FINISHED
      Result defined by MATHV1

    For extended commentary, see DMSRCN.
  */

 //--private com.ibm.icu.math._oui_bd dodivide(char code,com.ibm.icu.math._oui_bd rhs,com.ibm.icu.math._oui_bd_ set,int scale){
 function dodivide(code, rhs, set, scale) {
  //--com.ibm.icu.math._oui_bd lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //--int newexp;
  var newexp;
  //--com.ibm.icu.math._oui_bd res;
  var res;
  //--int newlen;
  var newlen;
  //--byte var1[];
  var var1;
  //--int var1len;
  var var1len;
  //--byte var2[];
  var var2;
  //--int var2len;
  var var2len;
  //--int b2b;
  var b2b;
  //--int have;
  var have;
  //--int thisdigit=0;
  var thisdigit=0;
  //--int i=0;
  var i=0;
  //--byte v2=0;
  var v2=0;
  //--int ba=0;
  var ba=0;
  //--int mult=0;
  var mult=0;
  //--int start=0;
  var start=0;
  //--int padding=0;
  var padding=0;
  //--int d=0;
  var d=0;
  //--byte newvar1[]=null;
  var newvar1=null;
  //--byte lasthave=0;
  var lasthave=0;
  //--int actdig=0;
  var actdig=0;
  //--byte newmant[]=null;
  var newmant=null;

  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity

  // [note we must have checked lostDigits before the following checks]
  if (rhs.ind==0)
   throw "dodivide(): Divide by 0"; // includes 0/0
  if (lhs.ind==0)
   { // 0/x => 0 [possibly with .0s]
    if (set.form!=_oui_bd_.prototype.PLAIN)
     return this.ZERO;
    if (scale==(-1))
     return lhs;
    return lhs.setScale(scale);
   }

  /* Prepare numbers according to _oui_bd rules */
  reqdig=set.digits; // local copy (heavily used)
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   }
  else
   {/* scaled divide */
    if (scale==(-1))
     scale=lhs.scale();
    // set reqdig to be at least large enough for the computation
    reqdig=lhs.mant.length; // base length
    // next line handles both positive lhs.exp and also scale mismatch
    if (scale!=(-lhs.exp))
     reqdig=(reqdig+scale)+lhs.exp;
    reqdig=(reqdig-((rhs.mant.length-1)))-rhs.exp; // reduce by RHS effect
    if (reqdig<lhs.mant.length)
     reqdig=lhs.mant.length; // clamp
    if (reqdig<rhs.mant.length)
     reqdig=rhs.mant.length; // ..
   }

  /* precalculate exponent */
  newexp=((lhs.exp-rhs.exp)+lhs.mant.length)-rhs.mant.length;
  /* If new exponent -ve, then some quick exits are possible */
  if (newexp<0)
   if (code!='D')
    {
     if (code=='I')
      return this.ZERO; // easy - no integer part
     /* Must be 'R'; remainder is [finished clone of] input value */
     return this.clone(lhs).finish(set,false);
    }

  /* We need slow division */
  res=new _oui_bd(); // where we'll build result
  res.ind=(lhs.ind*rhs.ind); // final sign (for D/I)
  res.exp=newexp; // initial exponent (for D/I)
  res.mant=this.createArrayWithZeros(reqdig+1); // where build the result

  /* Now [virtually pad the mantissae with trailing zeros */
  // Also copy the LHS, which will be our working array
  newlen=(reqdig+reqdig)+1;
  var1=this.extend(lhs.mant,newlen); // always makes longer, so new safe array
  var1len=newlen; // [remaining digits are 0]

  var2=rhs.mant;
  var2len=newlen;

  /* Calculate first two digits of rhs (var2), +1 for later estimations */
  b2b=(var2[0]*10)+1;
  if (var2.length>1)
   b2b=b2b+var2[1];

  /* start the long-division loops */
  have=0;
  {outer:for(;;){
   thisdigit=0;
   /* find the next digit */
   {inner:for(;;){
    if (var1len<var2len)
     break inner; // V1 too low
    if (var1len==var2len)
     { // compare needed
      {compare:do{ // comparison
       {var $22=var1len;i=0;i:for(;$22>0;$22--,i++){
        // var1len is always <= var1.length
        if (i<var2.length)
         v2=var2[i];
        else
         v2=0;
        if (var1[i]<v2)
         break inner; // V1 too low
        if (var1[i]>v2)
         break compare; // OK to subtract
        }
       }/*i*/
       /* reach here if lhs and rhs are identical; subtraction will
          increase digit by one, and the residue will be 0 so we
          are done; leave the loop with residue set to 0 (in case
          code is 'R' or ROUND_UNNECESSARY or a ROUND_HALF_xxxx is
          being checked) */
       thisdigit++;
       res.mant[have]=thisdigit;
       have++;
       var1[0]=0; // residue to 0 [this is all we'll test]
       // var1len=1      -- [optimized out]
       break outer;
      }while(false);}/*compare*/
      /* prepare for subtraction.  Estimate BA (lengths the same) */
      ba=var1[0]; // use only first digit
     } // lengths the same
    else
     {/* lhs longer than rhs */
      /* use first two digits for estimate */
      ba=var1[0]*10;
      if (var1len>1)
       ba=ba+var1[1];
     }
    /* subtraction needed; V1>=V2 */
    mult=div((ba*10),b2b);
    if (mult==0)
     mult=1;
    thisdigit=thisdigit+mult;
    // subtract; var1 reusable
    var1=this.byteaddsub(var1,var1len,var2,var2len,-mult,true);
    if (var1[0]!=0)
     continue inner; // maybe another subtract needed
    /* V1 now probably has leading zeros, remove leading 0's and try
       again. (It could be longer than V2) */
    {var $23=var1len-2;start=0;start:for(;start<=$23;start++){
     if (var1[start]!=0)
      break start;
     var1len--;
     }
    }/*start*/
    if (start==0)
     continue inner;
    // shift left
    //--java.lang.System.arraycopy((java.lang.Object)var1,start,(java.lang.Object)var1,0,var1len);
    this.arraycopy(var1,start,var1,0,var1len);
    }
   }/*inner*/

   /* We have the next digit */
   if ((have!=0)||(thisdigit!=0))
    { // put the digit we got
     res.mant[have]=thisdigit;
     have++;
     if (have==(reqdig+1))
      break outer; // we have all we need
     if (var1[0]==0)
      break outer; // residue now 0
    }
   /* can leave now if a scaled divide and exponent is small enough */
   if (scale>=0)
    if ((-res.exp)>scale)
     break outer;
   /* can leave now if not Divide and no integer part left  */
   if (code!='D')
    if (res.exp<=0)
     break outer;
   res.exp=res.exp-1; // reduce the exponent
   /* to get here, V1 is less than V2, so divide V2 by 10 and go for
      the next digit */
   var2len--;
   }
  }/*outer*/

  /* here when we have finished dividing, for some reason */
  // have is the number of digits we collected in res.mant
  if (have==0)
   have=1; // res.mant[0] is 0; we always want a digit

  if ((code=='I')||(code=='R'))
   {/* check for integer overflow needed */
    if ((have+res.exp)>reqdig)
     throw "dodivide(): Integer overflow";

    if (code=='R')
     {remainder:do{
      /* We were doing Remainder -- return the residue */
      if (res.mant[0]==0)  // no integer part was found
       return this.clone(lhs).finish(set,false); // .. so return lhs, canonical
      if (var1[0]==0)
       return this.ZERO; // simple 0 residue
      res.ind=lhs.ind; // sign is always as LHS
      /* Calculate the exponent by subtracting the number of padding zeros
         we added and adding the original exponent */
      padding=((reqdig+reqdig)+1)-lhs.mant.length;
      res.exp=(res.exp-padding)+lhs.exp;

      /* strip insignificant padding zeros from residue, and create/copy
         the resulting mantissa if need be */
      d=var1len;
      {i=d-1;i:for(;i>=1;i--){if(!((res.exp<lhs.exp)&&(res.exp<rhs.exp)))break;
       if (var1[i]!=0)
        break i;
       d--;
       res.exp=res.exp+1;
       }
      }/*i*/
      if (d<var1.length)
       {/* need to reduce */
        newvar1=new Array(d);
        //--java.lang.System.arraycopy((java.lang.Object)var1,0,(java.lang.Object)newvar1,0,d); // shorten
        this.arraycopy(var1,0,newvar1,0,d);
        var1=newvar1;
       }
      res.mant=var1;
      return res.finish(set,false);
     }while(false);}/*remainder*/
   }

  else
   {/* 'D' -- no overflow check needed */
    // If there was a residue then bump the final digit (iff 0 or 5)
    // so that the residue is visible for ROUND_UP, ROUND_HALF_xxx and
    // ROUND_UNNECESSARY checks (etc.) later.
    // [if we finished early, the residue will be 0]
    if (var1[0]!=0)
     { // residue not 0
      lasthave=res.mant[have-1];
      if (((lasthave%5))==0)
       res.mant[have-1]=(lasthave+1);
     }
   }

  /* Here for Divide or Integer Divide */
  // handle scaled results first ['I' always scale 0, optional for 'D']
  if (scale>=0)
   {scaled:do{
    // say 'scale have res.exp len' scale have res.exp res.mant.length
    if (have!=res.mant.length)
     // already padded with 0's, so just adjust exponent
     res.exp=res.exp-((res.mant.length-have));
    // calculate number of digits we really want [may be 0]
    actdig=res.mant.length-(((-res.exp)-scale));
    res.round(actdig,set.roundingMode); // round to desired length
    // This could have shifted left if round (say) 0.9->1[.0]
    // Repair if so by adding a zero and reducing exponent
    if (res.exp!=(-scale))
     {
      res.mant=this.extend(res.mant,res.mant.length+1);
      res.exp=res.exp-1;
     }
    return res.finish(set,true); // [strip if not PLAIN]
   }while(false);}/*scaled*/

  // reach here only if a non-scaled
  if (have==res.mant.length)
   { // got digits+1 digits
    res.round(set);
    have=reqdig;
   }
  else
   {/* have<=reqdig */
    if (res.mant[0]==0)
     return this.ZERO; // fastpath
    // make the mantissa truly just 'have' long
    // [we could let finish do this, during strip, if we adjusted
    // the exponent; however, truncation avoids the strip loop]
    newmant=new Array(have); // shorten
    //--java.lang.System.arraycopy((java.lang.Object)res.mant,0,(java.lang.Object)newmant,0,have);
    this.arraycopy(res.mant,0,newmant,0,have);
    res.mant=newmant;
   }
  return res.finish(set,true);
  }

 /* <sgml> Report a conversion exception. </sgml> */

 //--private void bad(char s[]){
 function bad(prefix, s) {
  throw prefix + "Not a number: "+s;
  }

 /* <sgml> Report a bad argument to a method. </sgml>
    Arg1 is method name
    Arg2 is argument position
    Arg3 is what was found */

 //--private void badarg(java.lang.String name,int pos,java.lang.String value){
 function badarg(name, pos, value) {
  throw "Bad argument "+pos+" to "+name+": "+value;
  }

 /* <sgml> Extend byte array to given length, padding with 0s.  If no
    extension is required then return the same array. </sgml>

    Arg1 is the source byte array
    Arg2 is the new length (longer)
    */

 //--private static final byte[] extend(byte inarr[],int newlen){
 function extend(inarr, newlen) {
  //--byte newarr[];
  var newarr;
  if (inarr.length==newlen)
   return inarr;
  newarr=createArrayWithZeros(newlen);
  //--java.lang.System.arraycopy((java.lang.Object)inarr,0,(java.lang.Object)newarr,0,inarr.length);
  this.arraycopy(inarr,0,newarr,0,inarr.length);
  // 0 padding is carried out by the JVM on allocation initialization
  return newarr;
  }

 /* <sgml> Add or subtract two >=0 integers in byte arrays
    <p>This routine performs the calculation:
    <pre>
    C=A+(B*M)
    </pre>
    Where M is in the range -9 through +9
    <p>
    If M<0 then A>=B must be true, so the result is always
    non-negative.

    Leading zeros are not removed after a subtraction.  The result is
    either the same length as the longer of A and B, or 1 longer than
    that (if a carry occurred).

    A is not altered unless Arg6 is 1.
    B is never altered.

    Arg1 is A
    Arg2 is A length to use (if longer than A, pad with 0's)
    Arg3 is B
    Arg4 is B length to use (if longer than B, pad with 0's)
    Arg5 is M, the multiplier
    Arg6 is 1 if A can be used to build the result (if it fits)

    This routine is severely performance-critical; *any* change here
    must be measured (timed) to assure no performance degradation.
    */
 // 1996.02.20 -- enhanced version of DMSRCN algorithm (1981)
 // 1997.10.05 -- changed to byte arrays (from char arrays)
 // 1998.07.01 -- changed to allow destructive reuse of LHS
 // 1998.07.01 -- changed to allow virtual lengths for the arrays
 // 1998.12.29 -- use lookaside for digit/carry calculation
 // 1999.08.07 -- avoid multiply when mult=1, and make db an int
 // 1999.12.22 -- special case m=-1, also drop 0 special case

 //--private static final byte[] byteaddsub(byte a[],int avlen,byte b[],int bvlen,int m,boolean reuse){
 function byteaddsub(a, avlen, b, bvlen, m, reuse) {
  //--int alength;
  var alength;
  //--int blength;
  var blength;
  //--int ap;
  var ap;
  //--int bp;
  var bp;
  //--int maxarr;
  var maxarr;
  //--byte reb[];
  var reb;
  //--boolean quickm;
  var quickm;
  //--int digit;
  var digit;
  //--int op=0;
  var op=0;
  //--int dp90=0;
  var dp90=0;
  //--byte newarr[];
  var newarr;
  //--int i=0;
  var i=0;




  // We'll usually be right if we assume no carry
  alength=a.length; // physical lengths
  blength=b.length; // ..
  ap=avlen-1; // -> final (rightmost) digit
  bp=bvlen-1; // ..
  maxarr=bp;
  if (maxarr<ap)
   maxarr=ap;
  reb=null; // result byte array
  if (reuse)
   if ((maxarr+1)==alength)
    reb=a; // OK to reuse A
  if (reb==null){
   reb=this.createArrayWithZeros(maxarr+1); // need new array
   }

  quickm=false; // 1 if no multiply needed
  if (m==1)
   quickm=true; // most common
  else
   if (m==(-1))
    quickm=true; // also common

  digit=0; // digit, with carry or borrow
  {op=maxarr;op:for(;op>=0;op--){
   if (ap>=0)
    {
     if (ap<alength)
      digit=digit+a[ap]; // within A
     ap--;
    }
   if (bp>=0)
    {
     if (bp<blength)
      { // within B
       if (quickm)
        {
         if (m>0)
          digit=digit+b[bp]; // most common
         else
          digit=digit-b[bp]; // also common
        }
       else
        digit=digit+(b[bp]*m);
      }
     bp--;
    }
   /* result so far (digit) could be -90 through 99 */
   if (digit<10)
    if (digit>=0)
     {quick:do{ // 0-9
      reb[op]=digit;
      digit=0; // no carry
      continue op;
     }while(false);}/*quick*/
   dp90=digit+90;
   reb[op]=this.bytedig[dp90]; // this digit
   digit=this.bytecar[dp90]; // carry or borrow
   }
  }/*op*/

  if (digit==0)
   return reb; // no carry
  // following line will become an Assert, later
  // if digit<0 then signal ArithmeticException("internal.error ["digit"]")

  /* We have carry -- need to make space for the extra digit */
  newarr=null;
  if (reuse)
   if ((maxarr+2)==a.length)
    newarr=a; // OK to reuse A
  if (newarr==null)
   newarr=new Array(maxarr+2);
  newarr[0]=digit; // the carried digit ..
  // .. and all the rest [use local loop for short numbers]
  //--if (maxarr<10)
   {var $24=maxarr+1;i=0;i:for(;$24>0;$24--,i++){
    newarr[i+1]=reb[i];
    }
   }/*i*/
  //--else
   //--java.lang.System.arraycopy((java.lang.Object)reb,0,(java.lang.Object)newarr,1,maxarr+1);
  return newarr;
  }

 /* <sgml> Initializer for digit array properties (lookaside). </sgml>
    Returns the digit array, and initializes the carry array. */

 //--private static final byte[] diginit(){
 function diginit() {
  //--byte work[];
  var work;
  //--int op=0;
  var op=0;
  //--int digit=0;
  var digit=0;
  work=new Array((90+99)+1);
  {op=0;op:for(;op<=(90+99);op++){
   digit=op-90;
   if (digit>=0)
    {
     work[op]=(digit%10);
     _oui_bd.prototype.bytecar[op]=(div(digit,10)); // calculate carry
     continue op;
    }
   // borrowing...
   digit=digit+100; // yes, this is right [consider -50]
   work[op]=(digit%10);
   _oui_bd.prototype.bytecar[op]=((div(digit,10))-10); // calculate borrow [NB: - after %]
   }
  }/*op*/
  return work;
  }

 /* <sgml> Create a copy of _oui_bd object for local use.
    <p>This does NOT make a copy of the mantissa array.
    </sgml>
    Arg1 is the _oui_bd to clone (non-null)
    */

 //--private static final com.ibm.icu.math._oui_bd clone(com.ibm.icu.math._oui_bd dec){
 function clone(dec) {
  //--com.ibm.icu.math._oui_bd copy;
  var copy;
  copy=new _oui_bd();
  copy.ind=dec.ind;
  copy.exp=dec.exp;
  copy.form=dec.form;
  copy.mant=dec.mant;
  return copy;
  }

 /* <sgml> Check one or two numbers for lost digits. </sgml>
    Arg1 is RHS (or null, if none)
    Arg2 is current DIGITS setting
    returns quietly or throws an exception */

 //--private void checkdigits(com.ibm.icu.math._oui_bd rhs,int dig){
 function checkdigits(rhs, dig) {
  if (dig==0)
   return; // don't check if digits=0
  // first check lhs...
  if (this.mant.length>dig)
   if ((!(this.allzero(this.mant,dig))))
    throw "Too many digits: "+this.toString();
  if (rhs==null)
   return; // monadic
  if (rhs.mant.length>dig)
   if ((!(this.allzero(rhs.mant,dig))))
    throw "Too many digits: "+rhs.toString();
  return;
  }

 /* <sgml> Round to specified digits, if necessary. </sgml>
    Arg1 is requested _oui_bd_ [with length and rounding mode]
    returns this, for convenience */

 //--private com.ibm.icu.math._oui_bd round(com.ibm.icu.math._oui_bd_ set){
 //-- return round(set.digits,set.roundingMode);
 //-- }

 /* <sgml> Round to specified digits, if necessary.
    Arg1 is requested length (digits to round to)
            [may be <=0 when called from format, dodivide, etc.]
    Arg2 is rounding mode
    returns this, for convenience

    ind and exp are adjusted, but not cleared for a mantissa of zero

    The length of the mantissa returned will be Arg1, except when Arg1
    is 0, in which case the returned mantissa length will be 1.
    </sgml>
    */

 //private com.ibm.icu.math._oui_bd round(int len,int mode){
 function round() {
  var len;
  var mode;
  if (round.arguments.length == 2)
   {
    len = round.arguments[0];
    mode = round.arguments[1];
   }
  else if (round.arguments.length == 1)
   {
    var set = round.arguments[0];
    len = set.digits;
    mode = set.roundingMode;
   }
  else
   {
    throw "round(): " + round.arguments.length + " arguments given; expected 1 or 2";
   }
  //int adjust;
  var adjust;
  //int sign;
  var sign;
  //byte oldmant[];
  var oldmant;
  //boolean reuse=false;
  var reuse=false;
  //--byte first=0;
  var first=0;
  //--int increment;
  var increment;
  //--byte newmant[]=null;
  var newmant=null;
  adjust=this.mant.length-len;
  if (adjust<=0)
   return this; // nowt to do

  this.exp=this.exp+adjust; // exponent of result
  sign=this.ind; // save [assumes -1, 0, 1]
  oldmant=this.mant; // save
  if (len>0)
   {
    // remove the unwanted digits
    this.mant=new Array(len);
    //--java.lang.System.arraycopy((java.lang.Object)oldmant,0,(java.lang.Object)mant,0,len);
    this.arraycopy(oldmant,0,this.mant,0,len);
    reuse=true; // can reuse mantissa
    first=oldmant[len]; // first of discarded digits
   }
  else
   {/* len<=0 */
    this.mant=this.ZERO.mant;
    this.ind=this.iszero;
    reuse=false; // cannot reuse mantissa
    if (len==0)
     first=oldmant[0];
    else
     first=0; // [virtual digit]
   }

  // decide rounding adjustment depending on mode, sign, and discarded digits
  increment=0; // bumper
  {modes:do{/*select*/
  if (mode==this.ROUND_HALF_UP)
   { // default first [most common]
    if (first>=5)
     increment=sign;
   }
  else if (mode==this.ROUND_UNNECESSARY)
   { // default for setScale()
    // discarding any non-zero digits is an error
    if ((!(this.allzero(oldmant,len))))
     throw "round(): Rounding necessary";
   }
  else if (mode==this.ROUND_HALF_DOWN)
   { // 0.5000 goes down
    if (first>5)
     increment=sign;
    else
     if (first==5)
      if ((!(this.allzero(oldmant,len+1))))
       increment=sign;
   }
  else if (mode==this.ROUND_HALF_EVEN)
   { // 0.5000 goes down if left digit even
    if (first>5)
     increment=sign;
    else
     if (first==5)
      {
       if ((!(this.allzero(oldmant,len+1))))
        increment=sign;
       else /* 0.5000 */
        if ((((this.mant[this.mant.length-1])%2))==1)
         increment=sign;
      }
   }
  else if (mode==this.ROUND_DOWN)
   {} // never increment
  else if (mode==this.ROUND_UP)
   { // increment if discarded non-zero
    if ((!(this.allzero(oldmant,len))))
     increment=sign;
   }
  else if (mode==this.ROUND_CEILING)
   { // more positive
    if (sign>0)
     if ((!(this.allzero(oldmant,len))))
      increment=sign;
   }
  else if (mode==this.ROUND_FLOOR)
   { // more negative
    if (sign<0)
     if ((!(this.allzero(oldmant,len))))
      increment=sign;
   }
  else{
   throw "round(): Bad round value: "+mode;
  }
  }while(false);}/*modes*/

  if (increment!=0)
   {bump:do{
    if (this.ind==this.iszero)
     {
      // we must not subtract from 0, but result is trivial anyway
      this.mant=this.ONE.mant;
      this.ind=increment;
     }
    else
     {
      // mantissa is non-0; we can safely add or subtract 1
      if (this.ind==this.isneg)
       increment=-increment;
      newmant=this.byteaddsub(this.mant,this.mant.length,this.ONE.mant,1,increment,reuse);
      if (newmant.length>this.mant.length)
       { // had a carry
        // drop rightmost digit and raise exponent
        this.exp++;
        // mant is already the correct length
        //java.lang.System.arraycopy((java.lang.Object)newmant,0,(java.lang.Object)mant,0,mant.length);
        this.arraycopy(newmant,0,this.mant,0,this.mant.length);
       }
      else
       this.mant=newmant;
     }
   }while(false);}/*bump*/
  // rounding can increase exponent significantly
  if (this.exp>this.MaxExp)
   throw "round(): Exponent Overflow: "+this.exp;
  return this;
  }

 /* <sgml> Test if rightmost digits are all 0.
    Arg1 is a mantissa array to test
    Arg2 is the offset of first digit to check
            [may be negative; if so, digits to left are 0's]
    returns 1 if all the digits starting at Arg2 are 0

    Arg2 may be beyond array bounds, in which case 1 is returned
    </sgml> */

 //--private static final boolean allzero(byte array[],int start){
 function allzero(array, start) {
  //--int i=0;
  var i=0;
  if (start<0)
   start=0;
  {var $25=array.length-1;i=start;i:for(;i<=$25;i++){
   if (array[i]!=0)
    return false;
   }
  }/*i*/
  return true;
  }

 /* <sgml> Carry out final checks and canonicalization
    <p>
    This finishes off the current number by:
      1. Rounding if necessary (NB: length includes leading zeros)
      2. Stripping trailing zeros (if requested and \PLAIN)
      3. Stripping leading zeros (always)
      4. Selecting exponential notation (if required)
      5. Converting a zero result to just '0' (if \PLAIN)
    In practice, these operations overlap and share code.
    It always sets form.
    </sgml>
    Arg1 is requested _oui_bd_ (length to round to, trigger, and FORM)
    Arg2 is 1 if trailing insignificant zeros should be removed after
         round (for division, etc.), provided that set.form isn't PLAIN.
   returns this, for convenience
   */

 //--private com.ibm.icu.math._oui_bd finish(com.ibm.icu.math._oui_bd_ set,boolean strip){
 function finish(set, strip) {
  //--int d=0;
  var d=0;
  //--int i=0;
  var i=0;
  //--byte newmant[]=null;
  var newmant=null;
  //--int mag=0;
  var mag=0;
  //--int sig=0;
  var sig=0;
  /* Round if mantissa too long and digits requested */
  if (set.digits!=0)
   if (this.mant.length>set.digits)
    this.round(set);

  /* If strip requested (and standard formatting), remove
     insignificant trailing zeros. */
  if (strip)
   if (set.form!=_oui_bd_.prototype.PLAIN)
    {
     d=this.mant.length;
     /* see if we need to drop any trailing zeros */
     {i=d-1;i:for(;i>=1;i--){
      if (this.mant[i]!=0)
       break i;
      d--;
      this.exp++;
      }
     }/*i*/
     if (d<this.mant.length)
      {/* need to reduce */
       newmant=new Array(d);
       //--java.lang.System.arraycopy((java.lang.Object)this.mant,0,(java.lang.Object)newmant,0,d);
       this.arraycopy(this.mant,0,newmant,0,d);
       this.mant=newmant;
      }
    }

  this.form=_oui_bd_.prototype.PLAIN; // preset

  /* Now check for leading- and all- zeros in mantissa */
  {var $26=this.mant.length;i=0;i:for(;$26>0;$26--,i++){
   if (this.mant[i]!=0)
    {
     // non-0 result; ind will be correct
     // remove leading zeros [e.g., after subtract]
     if (i>0)
      {delead:do{
       newmant=new Array(this.mant.length-i);
       //--java.lang.System.arraycopy((java.lang.Object)this.mant,i,(java.lang.Object)newmant,0,this.mant.length-i);
       this.arraycopy(this.mant,i,newmant,0,this.mant.length-i);
       this.mant=newmant;
      }while(false);}/*delead*/
     // now determine form if not PLAIN
     mag=this.exp+this.mant.length;
     if (mag>0)
      { // most common path
       if (mag>set.digits)
        if (set.digits!=0)
         this.form=set.form;
       if ((mag-1)<=this.MaxExp)
        return this; // no overflow; quick return
      }
     else
      if (mag<(-5))
       this.form=set.form;
     /* check for overflow */
     mag--;
     if ((mag<this.MinExp)||(mag>this.MaxExp))
      {overflow:do{
       // possible reprieve if form is engineering
       if (this.form==_oui_bd_.prototype.ENGINEERING)
        {
         sig=mag%3; // leftover
         if (sig<0)
          sig=3+sig; // negative exponent
         mag=mag-sig; // exponent to use
         // 1999.06.29: second test here must be MaxExp
         if (mag>=this.MinExp)
          if (mag<=this.MaxExp)
           break overflow;
        }
       throw "finish(): Exponent Overflow: "+mag;
      }while(false);}/*overflow*/
     return this;
    }
   }
  }/*i*/

  // Drop through to here only if mantissa is all zeros
  this.ind=this.iszero;
  {/*select*/
  if (set.form!=_oui_bd_.prototype.PLAIN)
   this.exp=0; // standard result; go to '0'
  else if (this.exp>0)
   this.exp=0; // +ve exponent also goes to '0'
  else{
   // a plain number with -ve exponent; preserve and check exponent
   if (this.exp<this.MinExp)
    throw "finish(): Exponent Overflow: "+this.exp;
  }
  }
  this.mant=this.ZERO.mant; // canonical mantissa
  return this;
  }

 function isGreaterThan(other) {
  return this.compareTo(other) > 0;
 };
 function isLessThan(other) {
  return this.compareTo(other) < 0;
 };
 function isGreaterThanOrEqualTo(other) {
  return this.compareTo(other) >= 0;
 };
 function isLessThanOrEqualTo(other) {
  return this.compareTo(other) <= 0;
 };
 function isPositive() {
  return this.compareTo(_oui_bd.prototype.ZERO) > 0;
 };
 function isNegative() {
  return this.compareTo(_oui_bd.prototype.ZERO) < 0;
 };
 function isZero() {
  return this.compareTo(_oui_bd.prototype.ZERO) === 0;
 };
return _oui_bd;
})(_oui_bd_); // _oui_bd depends on _oui_bd_

if (typeof define === "function" && define.amd != null) {
	// AMD-loader compatible resource declaration
	// require('bigdecimal') will return JS Object:
	// {'_oui_bd':_oui_bdPointer, '_oui_bd_':_oui_bd_Pointer}
	define({'_oui_bd':_oui_bd, '_oui_bd_':_oui_bd_});
} else if (typeof this === "object"){
	// global-polluting outcome.
	this._oui_bd = _oui_bd;
	this._oui_bd_ = _oui_bd_;
}

}).call(oui.BD); // in browser 'this' will be 'window' or simulated window object in AMD-loading scenarios.
})(window);})(window);








