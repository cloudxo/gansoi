var checks = new g.Collection('id');
var nodes = new g.Collection('name');
var agents = new g.Collection('name');
var notifiers = new g.Collection('name');
var evaluations = new g.Collection('CheckID');
var checkresults = new g.Collection('check_id');
var contacts = new g.Collection('id');
var contactgroups = new g.Collection('id');

var listChecks = Vue.component('list-checks', {
    data: function() {
        return {
            checks: checks
        };
    },

    methods: {
    },

    template: '#template-checks'
});

var listNodes = Vue.component('list-nodes', {
    data: function() {
        return {
            nodes: nodes
        };
    },

    template: '#template-nodes'
});

Vue.component('check-line', {
    props: {
        check: {default: {id: 'unkn'}}
    },

    data: function() {
        return {
            evaluations: evaluations
        };
    },

    methods: {
        viewCheck: function() {
            router.push('/check/view/' + this.check.id);
        },
    },

    computed: {
        klass: function() {
            var e = this.evaluations.get(this.check.id);

            if (!e) {
                return 'state unknown';
            }

            if (e.History && e.History.length > 0) {
                return 'state ' + e.History[0];
            }

            return 'state unknown';
        }
    },

    template: '#template-check-line'
});

var editCheck = Vue.component('edit-check', {
    data: function() {
        return {
            title: 'Add check',
            agents: agents.data,
            check: {
                interval: 30,
                arguments: {},
                agent: 'http',
                id: '',
                expressions: []
            },
            results: {results: {}},
            evaluations: evaluations
        };
    },

    created: function() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData();
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        deleteCheck: function(button) {
            button.disabled = true;

            Vue.http.delete('/api/checks/' + this.$route.params.id);
            router.push('/checks/');
        },

        addExpression: function() {
            if (this.check.expressions == null) {
                this.check.expressions = [];
            }
            this.check.expressions.push('');
        },

        removeExpression: function(index) {
            this.check.expressions.splice(index, 1);
        },

        fetchData: function() {
            var check = checks.get(this.$route.params.id);

            if (check != undefined) {
                check.interval /= 1000000000;
                this.title = "Edit " + this.$route.params.id;
                this.check = check;
            }
        },

        testCheck: function() {
            this.$http.post('/api/test', this.check).then(function(response) {
                this.results = response.body;
            });
        },

        addCheck: function() {
            this.check.interval *= 1000000000;
            this.$http.post('/api/checks', this.check).then(function(response) {
                router.push('/checks');
            });
        }
    },

    computed: {
        arguments: function() {
            var agentId = this.check.agent;
            var agent = agents.get(agentId);

            return agent.arguments;
        }
    },

    template: '#template-edit-check'
});

var viewCheck = Vue.component('view-check', {
    data: function() {
        return {
            checks: checks,
            evaluations: evaluations,
            checkresults: checkresults,
        };
    },

    computed: {
        id: function() {
            return this.$route.params.id;
        },

        check: function() {
            return checks.get(this.$route.params.id);
        },

        evaluation: function() {
            return evaluations.get(this.$route.params.id);
        },

        result: function() {
            var result = checkresults.get(this.$route.params.id);

            if (!result) {
                // Present an "empty" object to satisfy template requirements.
                return {
                    error: null,
                    results: []
                };
            }

            return result;
        }
    },

    methods: {
        editCheck: function(button) {
            router.push('/check/edit/' + this.$route.params.id);
        }
    },

    template: '#template-view-check'
});

var listContacts = Vue.component('list-contacts', {
    data: function() {
        return {
            contacts: contacts
        };
    },


    template: '#template-contacts'
});

Vue.component('contact-line', {
    props: {
        contact: {default: {id: 'unkn'}}
    },

    methods: {
        view: function() {
            router.push('/contact/view/' + this.contact.id);
        },
    },

    template: '#template-contact-line'
});

var editContact = Vue.component('edit-contact', {
    data: function() {
        return {
            title: 'Add Contact',
            notifiers: notifiers.data,
            contact: {
                id: '',
                notifier: 'slack',
                arguments: {},
            },
        };
    },

    created: function() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData();
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        deleteContact: function(button) {
            button.disabled = true;

            Vue.http.delete('/api/contacts/' + this.$route.params.id);
            router.push('/contacts/');
        },

        fetchData: function() {
            var contact = contacts.get(this.$route.params.id);

            if (contact != undefined) {
                this.title = "Edit " + this.$route.params.id;
                this.contact = contact;
            }
        },

        saveContact: function() {
            this.$http.post('/api/contacts', this.contact).then(function(response) {
                router.push('/contacts');
            });
        }
    },

    computed: {
        arguments: function() {
            var notifierId = this.contact.notifier;
            var notifier = notifiers.get(notifierId);

            return notifier.arguments;
        }
    },

    template: '#template-edit-contact'
});

var viewContact = Vue.component('view-contact', {
    data: function() {
        return {
            contacts: contacts
        };
    },

    computed: {
        id: function() {
            return this.$route.params.id;
        },

        contact: function() {
            return contacts.get(this.$route.params.id);
        }
    },

    methods: {
        editContact: function(button) {
            router.push('/contact/edit/' + this.$route.params.id);
        }
    },

    template: '#template-view-contact'
});

var listContactgroups = Vue.component('list-contactgroups', {
    data: function() {
        return {
            contactgroups: contactgroups
        };
    },

    template: '#template-contactgroups'
});

Vue.component('contactgroup-line', {
    props: {
        contactgroup: {default: {id: 'unkn'}}
    },

    methods: {
        view: function() {
            router.push('/contactgroup/view/' + this.contactgroup.id);
        },
    },

    template: '#template-contactgroup-line'
});

var editContactgroup = Vue.component('edit-contactgroup', {
    data: function() {
        return {
            title: 'Add Contact Group',
            contactgroup: {
                id: '',
                members: [],
            },
            contacts: contacts,
        };
    },

    created: function() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData();
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        deleteContactgroup: function(button) {
            button.disabled = true;

            Vue.http.delete('/api/contactgroups/' + this.$route.params.id);
            router.push('/contactgroups/');
        },

        fetchData: function() {
            var contactgroup = contactgroups.get(this.$route.params.id);

            if (contactgroup != undefined) {
                this.title = "Edit " + this.$route.params.id;
                this.contactgroup = contactgroup;
            }
        },

        saveContactgroup: function() {
            this.$http.post('/api/contactgroups', this.contactgroup).then(function(response) {
                router.push('/contactgroups');
            });
        }
    },

    template: '#template-edit-contactgroup'
});

var viewContactgroup = Vue.component('view-contactgroup', {
    data: function() {
        return {
            contactgroups: contactgroups,
            contacts: contacts,
        };
    },

    computed: {
        id: function() {
            return this.$route.params.id;
        },

        contactgroup: function() {
            return contactgroups.get(this.$route.params.id);
        }
    },

    methods: {
        editContactgroup: function(button) {
            router.push('/contactgroup/edit/' + this.$route.params.id);
        }
    },

    template: '#template-view-contactgroup'
});

var init = g.waitGroup(function() {
    var live = g.live();

    live.subscribe('nodeinfo', nodes);
    live.subscribe('checkresult', checkresults);
    live.subscribe('check', checks);
    live.subscribe('evaluation', evaluations);
    live.subscribe('contact', contacts);
    live.subscribe('contactgroup', contactgroups);

    const app = new Vue({
        el: '#app',
        router: router
    });
});

Vue.http.get('/api/agents').then(function(response) {
    init.add(1);
    response.body.forEach(function(check) {
        agents.upsert(check);
        init.done();
    });
});

Vue.http.get('/api/notifiers').then(function(response) {
    init.add(1);
    response.body.forEach(function(check) {
        notifiers.upsert(check);
        init.done();
    });
});

Vue.http.get('/api/checks').then(function(response) {
    init.add(1);
    response.body.forEach(function(check) {
        checks.upsert(check);
        init.done();
    });
});

Vue.http.get('/api/evaluations').then(function(response) {
    init.add(1);
    response.body.forEach(function(evaluation) {
        evaluations.upsert(evaluation);
        init.done();
    });
});

Vue.http.get('/api/contacts').then(function(response) {
    init.add(1);
    response.body.forEach(function(contact) {
        contacts.upsert(contact);
        init.done();
    });
});

Vue.http.get('/api/contactgroups').then(function(response) {
    init.add(1);
    response.body.forEach(function(group) {
        contactgroups.upsert(group);
        init.done();
    });
});

const router = new VueRouter({
    routes: [
        { path: '/', component: { template: '<h1>Hello, world.</h1>' } },
        { path: '/overview', component: { template: '#template-overview' } },
        { path: '/gansoi', component: listNodes },

        { path: '/checks', component: listChecks },
        { path: '/check/view/:id', component: viewCheck },
        { path: '/check/edit/:id', component: editCheck },

        { path: '/contacts', component: listContacts },
        { path: '/contact/view/:id', component: viewContact },
        { path: '/contact/edit/:id', component: editContact },

        { path: '/contactgroups', component: listContactgroups },
        { path: '/contactgroup/view/:id', component: viewContactgroup },
        { path: '/contactgroup/edit/:id', component: editContactgroup },
    ]
});
