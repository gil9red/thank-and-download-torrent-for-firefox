// TODO: исправить
/*
 This add-on is incompatible with Firefox 43.0.1, the latest
 release of Firefox. Please consider updating your add-on's
 compatibility info, or uploading a newer version of this add-on.
*/

/*
Comments:
Your preliminary review request has been approved.

Please note the following for the next update:
-1) Your add-on prints debugging information to the Console, which is generally not allowed in production add-ons.
-2) Listening to both tabs.on('activate', ...) & tabs.on('ready', ...) can result in the script being run multiple times and needlessly.
-3) Please use a 'PageMod' instance rather than manually tracking tab events and attaching content scripts.
-https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod

4) Add-on contains duplicate/hidden/unused/unnecessary files or folders. These complicate the review process and may contain sensitive information about the system you created the XPI on. Such files may also create cause for rejection. Please correct your packaging process so that these files aren't included.
e.g.:
README.md
run.bat
xpi.bat

Thank you.
*/

// TODO: при запуск первой вкладке кнопка не показывается
// TODO: плагин иногда перестает работать, лечится переключением на вкладку отличную от URL_TORRENT
// TODO: плагин иногда не видно на вкладке URL_TORRENT, лечится переключением вкладок
// TODO: "Спасибо" после клика не обновляется, хотя при вручном клике обновляется
// TODO: говорить "спасибо" только после скачивания/открытия торрент файла
// TODO: при переключении вкладок и активации кнопки выполнился скрипт download_and_thank.js не
// текущей вкладке, а в соседней
// TODO: проверка кнопки при смене адреса, например, заходим на http://torrent.mgn.ru, после
// идем на страницу раздачи, *появляется кнопка плагина*, нажимаю на кнопку предыдущей страницы,
// попадаю на http://torrent.mgn.ru, кнопка плагина не исчезла



var DEBUG = true;

function d(mess) {
    DEBUG && console.log(mess);
}

d("Start plugin");

// Импортирование модулей
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");

// Основная часть url раздач, например http://torrent.mgn.ru/viewtopic.php?t=72938
var URL_TORRENT = 'http://torrent.mgn.ru/viewtopic.php?t=';
URL_TORRENT = "http://habrahabr.ru/";

if (DEBUG) {
    d("Open debug tab");

    tabs.open('http://habrahabr.ru');
    tabs.open('http://habrahabr.ru/post/273397/');

//    // Open a new tab in a new window and make it active.
//    tabs.open({
//        url: "http://www.mysite.com",
//        inNewWindow: true
//    });

    tabs[0].close();
}

// Ссылка на кнопку плагина
var download_torrent_mgn_ru = null;

d("Add handlers activate and open tabs");


function createButton() {
    d("Start create button");
    d(download_torrent_mgn_ru == null ? "Button not exist, create button" : "Button exist");

    // Создаем кнопку
    if (download_torrent_mgn_ru == null) {
        // Кнопка клика кнопки скачивания раздачи и кнопки "спасибо" сайта http://torrent.mgn.ru
        download_torrent_mgn_ru = buttons.ActionButton({
            id: "download_torrent_mgn_ru",
            label: "Download and thank torrent from torrent.mgn.ru",
            icon: "./tor_icon.jpg",

            // При клике выполняем скрипт
            onClick: function () {
                // Для активной вкладки вызываем скрипт
                tabs.activeTab.attach({
                    contentScriptFile: "./download_and_thank.js"
                });
            }
        });
    }

    d("Finish create button");
}

function deleteButton() {
    d("Start delete button");
    d(download_torrent_mgn_ru != null ? "Button exist, delete button" : "Button not exist");

    if (download_torrent_mgn_ru != null) {
        download_torrent_mgn_ru.destroy()
        download_torrent_mgn_ru = null;
    }

    d("Finish delete button");
}


pageMod.PageMod({
    //// Not working! Why? O_o
    //include: "/*habrahabr.ru/*",
    // TODO: проверить
    //include: /http:\/\/torrent\.mgn\.ru\/viewtopic\.php\?t=.+/,
    include: /.+habrahabr.ru\/post.+/,

    attachTo: ["existing", "top"],
    contentScriptWhen: "start",

    onAttach: function onAttach(worker) {
        var tab = worker.tab;

        d('onAttach ' + worker.url + ' (' + tab.title + ')');

//        createButton();
        tab.on('activate', function() {
            d('on activate tab ' + tab.url + ' start');
            createButton();
            d('on activate tab finish');
        });

        tab.on('pageshow', function() {
            d('on pageshow tab ' + tab.url + ' start');
            createButton();
            d('on pageshow tab finish');
        });

        tab.on('deactivate', function() {
            d('on deactivate tab ' + tab.url + ' start');
            deleteButton();
            d('on deactivate tab finish');
        });
        tab.on('close', function() {
            d('on close tab ' + tab.url + ' start');
            deleteButton();
            d('on close tab finish');
        });
    }
});

// TODO: плагин работает с одним окном
//// When open new tab as new window, need check url tab -- remove button plugin
//// for not URL_TORRENT tabs
//var windows = require("sdk/windows").browserWindows;
////windows.on('open', function(window) {
////    var tab = window.tabs.activeTab;
////    d('on open new window with tab url ' + tab.url + ' start');
////
////    if (tab.url.startsWith(URL_TORRENT) == false) {
////        d('Tab not valid, remove plugin button');
////        deleteButton();
////    }
////
////    d('on open new window with tab url ' + tab.url + ' finish');
////});
//
//windows.on('activate', function(window) {
//    var tab = window.tabs.activeTab;
//    d('on activate new window with tab url ' + tab.url + ' start');
//
//    if (tab.url.startsWith(URL_TORRENT) == false) {
//        d('Tab not valid, remove plugin button');
//        deleteButton();
//    }
//
//    d('on activate new window with tab url ' + tab.url + ' finish');
//});
//
////windows.on('deactivate', function(window) {
////    var tab = window.tabs.activeTab;
////    d('on deactivate new window with tab url ' + tab.url + ' start');
////
////    if (tab.url.startsWith(URL_TORRENT) == false) {
////        d('Tab not valid, remove plugin button');
////        deleteButton();
////    }
////
////    d('on deactivate new window with tab url ' + tab.url + ' finish');
////});
//
//
////// When open new tab, need check url tab -- remove button plugin
////// for not URL_TORRENT tabs
////tabs.on('open', function(tab) {
////    d('on open tab ' + tab.url + ' start');
////
////    if (tab.url.startsWith(deleteButton) == false) {
////        d('Tab not valid, remove plugin button');
////        deleteButton();
////    }
////
////    d('on open tab ' + tab.url + ' finish');
////});


d("Finish plugin");
