module.exports = {

    el: '#download-files',

    data: function () {
        return _.merge({
            files: false,
            pages: 0,
            count: '',
            selected: []
        }, window.$data);
    },

    created: function () {
        this.resource = this.$resource('api/download/file/{id}');
        this.config.filter = _.extend({
            status: '',
            category_id: '',
            search: '',
            order: this.config.ordering + ' ' + this.config.ordering_dir,
            limit: this.config.files_per_page
        }, this.config.filter);
    },

    computed: {

        statusOptions: function () {

            var options = _.map(this.statuses, function (status, id) {
                return { text: status, value: id };
            });

            return [{ label: this.$trans('Filter by'), options: options }];
        },

        categoryOptions: function () {
            var options = _.map(this.categories, function (category) {
                return { text: category.title, value: category.id };
            });

            return [{ label: this.$trans('Filter by'), options: options }];
        }
    },

    methods: {

        active: function (portfolio) {
            return this.selected.indexOf(portfolio.id) !== -1;
        },

        load: function (page) {

            page = page !== undefined ? page : this.config.page;

            return this.resource.query({ filter: this.config.filter, page: page }).then(function (res) {
                this.$set('files', res.data.files);
                this.$set('pages', res.data.pages);
                this.$set('count', res.data.count);
                this.$set('config.page', page);
                this.$set('selected', []);
            });
        },

        save: function (file) {
            this.resource.save({ id: file.id }, { file: file }).then(function () {
                this.load();
                this.$notify('File saved.');
            });
        },

        status: function (status) {

            var files = this.getSelected();

            files.forEach(function (file) {
                file.status = status;
            });

            this.resource.save({ id: 'bulk' }, { files: files }).then(function () {
                this.load();
                this.$notify('Files saved.');
            });
        },

        toggleStatus: function (file) {
            file.status = file.status === 0 ? 1 : 0;
            this.save(file);
        },

        getSelected: function () {
            return this.files.filter(function (file) {
                return this.selected.indexOf(file.id) !== -1;
            }, this);
        },

        removeFiles: function () {

            this.resource.delete({id: 'bulk'}, {ids: this.selected}).then(function () {
                this.load();
                this.$notify('File(s) deleted.');
            });
        },

        getStatusText: function (file) {
            return this.statuses[file.status];
        }

    },

    watch: {
        'config.page': 'load',

        'config.filter': {
            handler: function () { this.load(0); },
            deep: true
        }
    }


};

Vue.ready(module.exports);
