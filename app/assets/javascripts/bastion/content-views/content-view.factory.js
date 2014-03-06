/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

/**
 * @ngdoc service
 * @name  Bastion.content-views.factory:ContentView
 *
 * @requires $resource
 * @requires CurrentOrganization
 *
 * @description
 *   Provides a $resource for interacting with environments.
 */
angular.module('Bastion.content-views').factory('ContentView',
    ['$resource', 'CurrentOrganization',
    function ($resource, CurrentOrganization) {
        var resource =
         $resource('/api/v2/content_views/:id/:action',
            {id: '@id', 'organization_id': CurrentOrganization},
            {
                query:  {method: 'GET', isArray: false},
                update: {method: 'PUT'},
                publish: {method: 'POST', params: {action: 'publish'}},
                history: {method: 'GET', params: {action: 'history'}},
                versions: {method: 'GET', isArray: false, params: {action: 'content_view_versions'}},
                components: {method: 'GET', transformResponse: function (data) {
                    var contentView = angular.fromJson(data);
                    return {results: contentView.components};
                }},
                compositeEligible: {method: 'GET', transformResponse: function (data) {
                    var contentViews = angular.fromJson(data).results;
                    contentViews = _.filter(contentViews, function (contentView) {
                        return !contentView.composite && contentView.versions.length > 0;
                    });
                    return {results: contentViews};
                }}
            }
        );
        resource.availablePuppetModuleNames = function(){ return {
            total: 10,
            subtotal: 10,
            results: [
                {name: 'apple'},
                {name: 'pear'},
                {name: 'peach'},
                {name: 'pepper'},
                {name: 'orange'},
                {name: 'mango'},
                {name: 'pineapple'},
                {name: 'tomayto'},
                {name: 'tomahto'},
                {name: 'plum'}
            ]
        }};

        return resource;
    }]
);
