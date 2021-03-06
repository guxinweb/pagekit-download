
module.exports = {

    el: '#category-edit',

    data: function () {
        return _.merge({
            category: {},
            roles: [],
            form: {}
        }, window.$data);
    },

    ready: function () {
        var vm = this;
        UIkit.sortable(this.$els.sortable, {
            handleClass: 'pk-icon-move'
        }).on('change.uk.sortable', function (e, sortable, el) {
            var catordering = 1;
            _.forEach(sortable.serialize(), function (file) {
                _.find(vm.category.files, 'id', file.id).catordering = catordering;
                catordering += 1;
            });
        });
        this.resource = this.$resource('api/download/category/{id}');

    },

    computed: {

        path: function () {
            return (this.category.path ? this.category.path.split('/').slice(0, -1).join('/') : '') + '/' + (this.category.slug || '');
        }

    },

    methods: {

        save: function () {

            var data = {category: this.category};

            this.$broadcast('save', data);

            this.resource.save({id: this.category.id || 0}, data).then(function (res) {

                if (!this.category.id) {
                    window.history.replaceState({}, '', this.$url.route('admin/download/category/edit', {id: res.data.category.id}));
                }

                this.$set('category', res.data.category);

                this.$broadcast('saved', res.data);

                this.$notify(this.$trans('Category %title% saved.', {title: this.category.title}));

            }, function (res) {
                this.$notify(res.data, 'danger');
            });
        }

    }

};

Vue.ready(module.exports);
