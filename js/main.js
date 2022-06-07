'use strict';
/* Text Scramble Effect */
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var TextScramble = function () {
    function TextScramble(el) {
        _classCallCheck(this, TextScramble);

        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    TextScramble.prototype.setText = function setText(newText) {
        var _this = this;

        var oldText = this.el.innerText;
        var length = Math.max(oldText.length, newText.length);
        var promise = new Promise(function (resolve) {
            return _this.resolve = resolve;
        });
        this.queue = [];
        for (var i = 0; i < length; i++) {
            var from = oldText[i] || '';
            var to = newText[i] || '';
            var start = Math.floor(Math.random() * 40);
            var end = start + Math.floor(Math.random() * 40);
            this.queue.push({
                from: from,
                to: to,
                start: start,
                end: end
            });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    };

    TextScramble.prototype.update = function update() {
        var output = '';
        var complete = 0;
        for (var i = 0, n = this.queue.length; i < n; i++) {
            var _queue$i = this.queue[i];
            var from = _queue$i.from;
            var to = _queue$i.to;
            var start = _queue$i.start;
            var end = _queue$i.end;
            var char = _queue$i.char;

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += '<span class="dud">' + char + '</span>';
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    };

    TextScramble.prototype.randomChar = function randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    };

    return TextScramble;
}();
//Asynchronously load JSON. Modify JSON file to change password or reward text
$.getJSON("./data.json", function (data) {
    //Check for correct passwords
    setInterval(function(){
        if ($('.' + data[0].div + ' > div:nth-child(4) .reward').html() !== "" && $('.' + data[1].div + ' > div:nth-child(4) .reward').html() !== "" && $('.' + data[2].div + ' > div:nth-child(4) .reward').html() !== "" && $('.' + data[3].div + ' > div:nth-child(4) .reward').html() !== "") {
            $('.' + data[4].div + ' > div:nth-child(2) .input').prop('disabled', false);
            $('.' + data[4].div + ' > div:nth-child(2) .input').attr("placeholder", "unlocked!");
        } else {
            $('.' + data[4].div + ' > div:nth-child(2) .input').prop('disabled', true);
            $('.' + data[4].div + ' > div:nth-child(2) .input').attr("placeholder", "locked");
        }
    },500);
    //Set validation text
    function setValidation(num, valid, which) {
        var fx = new TextScramble($('.' + data[num].div + ' div:nth-child(3) .validation')[0]);
        if (valid) {
            setReward(num, false);
            fx.setText("Correct!");
        } else {
            setReward(num, true);
            fx.setText("Incorrect!");
        }
    }
    //Set reward text
    function setReward(num, clear) {
        var el = $('.' + data[num].div + ' div:nth-child(4) .reward');
        var fx = new TextScramble($('.' + data[num].div + ' div:nth-child(4) .reward')[0]);
        if (!clear) {
            fx.setText(data[num].reward);
        } else {
            el.text('');
        }
    }
    //Bind inputs
    $('.' + data[0].div + ' > div:nth-child(2) .input').keyup(function (e) {
        if ($(this).val().toLowerCase() == data[0].pass.toLowerCase()) {
            setValidation(0, true, 1);
        } else {
            setValidation(0, false);
        }
    });
    $('.' + data[1].div + ' > div:nth-child(2) .input').keyup(function (e) {
        if ($(this).val().toLowerCase() == data[1].pass.toLowerCase()) {
            setValidation(1, true);
        } else {
            setValidation(1, false, 2);
        }
    });
    $('.' + data[2].div + ' > div:nth-child(2) .input').keyup(function (e) {
        if ($(this).val().toLowerCase() == data[2].pass.toLowerCase()) {
            setValidation(2, true);
        } else {
            setValidation(2, false, 3);
        }
    });
    $('.' + data[3].div + ' > div:nth-child(2) .input').keyup(function (e) {
        if ($(this).val().toLowerCase() == data[3].pass.toLowerCase()) {
            setValidation(3, true);
        } else {
            setValidation(3, false, 4);
        }
    });
    $('.' + data[4].div + ' > div:nth-child(2) .input').prop('disabled', true);
    $('.' + data[4].div + ' > div:nth-child(2) .input').keyup(function (e) {
        if ($(this).val().toLowerCase() == data[4].pass.toLowerCase()) {
            setValidation(4, true);
        } else {
            setValidation(4, false, 5);
        }
    });
});
