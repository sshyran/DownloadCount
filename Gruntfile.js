module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        shipit: {
            options: {
                workspace: '.',
                deployTo: '/opt/dlcount',
                ignores: ['.git', '.gitkeep', '.gitignore', '.jshintrc', 'node_modules'],
                keepReleases: 5
            },
            prd: {
                servers: ['app@count.ghost.org']
            }
        }
    });

    grunt.loadNpmTasks('grunt-shipit');
    grunt.loadNpmTasks('shipit-deploy');

    grunt.shipit.on('published', function () {
        grunt.task.run(['link-shared-dir:log:node_modules', 'link-config', 'create-tmp', 'npm-install', 'start']);
    });

    grunt.registerTask('link-shared-dir', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        this.args.forEach(function (dir) {
            grunt.shipit.remote('mkdir -p ' + deployDir + '/shared/' + dir, function () {
                grunt.shipit.remote('ln -nfs ' + deployDir + '/shared/' + dir + ' ' + current + '/' + dir, done);
            });
        });
    });

    grunt.registerTask('link-config', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        grunt.shipit.remote('ln -nfs ' + deployDir + '/shared/config.json ' + current + '/config.json', done);
    });

    grunt.registerTask('create-tmp', function () {
        var done = this.async(),
            current = grunt.config('shipit.options.deployTo') + '/current';

        grunt.shipit.remote('mkdir -p ' + current + '/tmp', done);
    });

    grunt.registerTask('npm-install', function () {
        var done = this.async(),
            current = grunt.config('shipit.options.deployTo') + '/current';

        grunt.shipit.remote('cd ' + current + ' && npm install', done);
    });

    grunt.registerTask('start', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        grunt.shipit.remote('cd ' + current + ' && touch tmp/restart.txt', done);
    });

    grunt.registerTask('deploy', [
        'deploy:init',
        'deploy:update',
        'deploy:publish',
        'deploy:clean'
    ]);
};