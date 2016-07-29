(function (golbal) {
    var dialog = {}
    golbal.dialog = dialog;

    dialog.showDialog = function (title, msg, handler) {
        var dlg = document.getElementById("y_dialog");
        if (!dlg) {
            dlg = createDlg();
            dlg.querySelector('.confirm').addEventListener('click', function () {
                dlg.style.display = 'none';
                if (handler && typeof handler === 'function')
                    handler();
            });
        }
        dlg.querySelector('.tit').innerHTML = title;
        dlg.querySelector('.content').innerHTML = msg;
        dlg.style.display = 'block';
    }

    function createDlg() {
        var dlg = document.createElement('div');
        dlg.id = 'y_dialog';
        dlg.innerHTML = '<div class="y_dialog_content">'
            + '<p class="tit"></p>'
            + '<div class="content"></div>'
            + '<input class="confirm" type="button" value="确定"/>'
            + '</div>';
        document.body.appendChild(dlg);
        return dlg;
    }


    dialog.showConfirm = function (title, msg,okHandler,cancelHandler) {
        var confirm = document.getElementById("y_confirm");
        if (!confirm) {
            confirm = createConfirm();
            document.getElementById("y_confirm_cancel").addEventListener('click', function () {
                confirm.style.display = 'none';
                if (cancelHandler && typeof cancelHandler === 'function')
                    cancelHandler();
            });
            document.getElementById("y_confirm_ok").addEventListener('click', function () {
                confirm.style.display = 'none';
                if (okHandler && typeof okHandler === 'function')
                    okHandler();
            });
        }
        confirm.querySelector('.tit').innerHTML = title;
        confirm.querySelector('.content').innerHTML = msg;
        confirm.style.display = 'block';

    }

    function createConfirm() {
        var confirm = document.createElement('div');
        confirm.id = 'y_confirm';
        confirm.innerHTML = '<div class="y_dialog_content">'
            + '<p class="tit"></p>'
            + '<div class="content"></div>'
            + '<input id="y_confirm_cancel" class="btn" type="button" value="取消"/>'
            + '<input id="y_confirm_ok" class="btn" type="button" value="确定"/>'
            + '</div>';
        document.body.appendChild(confirm);
        return confirm;
    }

    dialog.tip = function (msg, disappearTime, callback) {
        var tipele = document.getElementById("tip");
        if (!tipele) {
            tipele = createTip();
        }
        tipele.innerHTML = '<span style="border-radius:8px;display:inline-block;max-width:50%;padding:1.4rem 2rem;font-size:1.2rem;background-color:rgba(0, 0, 0, 0.6);margin-top:60%;">' + msg + '</span>';
        tipele.style.display = 'block';

        setTimeout(function () {
            tipele.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }, disappearTime||1000)
    }

    function createTip() {
        var tipele = document.createElement('div');
        tipele.id = 'tip';
        tipele.style.display = 'none';
        tipele.style.position = 'fixed';
        tipele.style.top = '0';
        tipele.style.left = '0';
        tipele.style.right = '0';
        tipele.style.bottom = '0';
        tipele.style.zIndex = '98';
        tipele.style.color = '#FFFFFF';
        tipele.style.textAlign = 'center';
        document.body.appendChild(tipele);
        return tipele;
    }

    dialog.showPropmt = function (title,okHandler,cancelHandler) {
        var propmt = document.getElementById("y_propmt");
        if (!propmt) {
            propmt = createPropmt();
            document.getElementById("y_propmt_cancel").addEventListener('click', function () {
                propmt.style.display = 'none';
                if (cancelHandler && typeof cancelHandler === 'function')
                    cancelHandler(propmt.querySelector('.inputcontent').value);
            });
            document.getElementById("y_propmt_ok").addEventListener('click', function () {
                propmt.style.display = 'none';
                if (okHandler && typeof okHandler === 'function')
                    okHandler(propmt.querySelector('.inputcontent').value);
            });
        }
        propmt.querySelector('.tit').innerHTML = title||'请输入内容';
        propmt.style.display = 'block';

    }

    function createPropmt() {
        var propmt = document.createElement('div');
        propmt.id = 'y_propmt';
        propmt.innerHTML = '<div class="y_dialog_content">'
            + '<p class="tit"></p>'
            + '<input class="inputcontent" type="text" />'
            + '<input id="y_propmt_cancel" class="btn" type="button" value="取消"/>'
            + '<input id="y_propmt_ok" class="btn" type="button" value="确定"/>'
            + '</div>';
        document.body.appendChild(propmt);
        return propmt;
    }
})(typeof window !== "undefined" ? window : this)
