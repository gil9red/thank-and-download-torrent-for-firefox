// TODO: исправить
/*
General Tests
0 errors, 1 warning, 0 notices
Add-on has potentially illegal name.

Warning: Add-on names cannot contain the Mozilla or Firefox trademarks. These names should not be contained in add-on names if at all possible.
install.rdf
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
