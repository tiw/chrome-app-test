window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

var converter = new Showdown.converter();
var myApp = angular.module('myApp', []);
myApp.controller('TestCtrl', function($scope) {
    $scope.$watch('markdown', function(newValue, oldValue) {
        if (newValue) {
            $scope.html = converter.makeHtml(newValue);
        }
    });
    $scope.save = function() {
        function onInitFs(fs) {
            console.log('Opened file system: ' + fs.name);
        }
        window.requestFileSystem(
            window.TEMPORARY, 5 * 1024 * 1024, onInitFs, errorHandler

        );
        function onInitFs(fs) {

            fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {

                    fileWriter.onwriteend = function(e) {
                        console.log(fileEntry, fs.root);
                        console.log('Write completed.');
                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };

                    // Create a new Blob and write it to log.txt.
                    var blob = new Blob([$scope.markdown], {type: 'text/plain'});

                    fileWriter.write(blob);

                }, errorHandler);

            }, errorHandler);

        };
        function errorHandler(e) {
            var msg = '';

            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                break;
                default:
                    msg = 'Unknown Error';
                break;
            }

            console.log('Error: ' + msg);
        }
    };
});
