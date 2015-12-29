// TODO: исправить
/*
General Tests
0 errors, 1 warning, 0 notices
Add-on has potentially illegal name.

Warning: Add-on names cannot contain the Mozilla or Firefox trademarks. These names should not be contained in add-on names if at all possible.
install.rdf
*/

/*
 This add-on is incompatible with Firefox 43.0.1, the latest
 release of Firefox. Please consider updating your add-on's
 compatibility info, or uploading a newer version of this add-on.
*/

/*
Comments:
Your preliminary review request has been approved.

Please note the following for the next update:
1) Your add-on prints debugging information to the Console, which is generally not allowed in production add-ons.

2) Listening to both tabs.on('activate', ...) & tabs.on('ready', ...) can result in the script being run multiple times and needlessly.

3) Please use a 'PageMod' instance rather than manually tracking tab events and attaching content scripts.
https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod

4) Add-on contains duplicate/hidden/unused/unnecessary files or folders. These complicate the review process and may contain sensitive information about the system you created the XPI on. Such files may also create cause for rejection. Please correct your packaging process so that these files aren't included.
e.g.:
README.md
run.bat
xpi.bat

Thank you.
*/


// Импортирование модулей
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var url_torrent = 'http://torrent.mgn.ru/';

// Ссылка на кнопку плагина
var download_torrent_mgn_ru = null;


function check_tab(tab) {
    // Проверяем что вкладка относится к url_torrent
    if (tab.url.startsWith(url_torrent)) {
        // Создаем кнопку
        if (download_torrent_mgn_ru == null) {
            // Кнопка клика кнопки скачивания раздачи и кнопки "спасибо" сайта http://torrent.mgn.ru
            download_torrent_mgn_ru = buttons.ActionButton({
                id: "download_torrent_mgn_ru",
                label: "Download and thank torrent from torrent.mgn.ru",
                icon: "./tor_icon.jpg",

                // При клике выполняем скрипт
                onClick: function () {
                    tab.attach({
                        contentScriptFile: "./download_and_thank.js"
                    });
                }
            });
        }

    // Иначе, удаляем кнопку
    } else {
        if (download_torrent_mgn_ru != null) {
            download_torrent_mgn_ru.destroy()
            download_torrent_mgn_ru = null;
        }
    }
}


// Проверяем вкладку переходе на нее
tabs.on('activate', check_tab);

// Проверяем вкладку при открытии
tabs.on('open', function(tab){
    tabs.on('ready', check_tab)
});
