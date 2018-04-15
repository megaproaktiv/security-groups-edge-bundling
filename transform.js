'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

var transformPromise = function (data) {
  var promise = new Promise(function (resolve, rejct) {
    var securityGroups = data.SecurityGroups;
    // console.dir(securityGroups);
    resolve(_(securityGroups)
      .map(function (sg) {
        var ingressUnflat = sg.IpPermissions.map(function (i) {
          var name;
          var entries=[];
          let description ='';
          if (i.UserIdGroupPairs.length > 0) {
            var name = _.find(securityGroups, _.matchesProperty('GroupId', i.UserIdGroupPairs[0].GroupId));
            name = name.GroupName;

            let entry = {
              name: name,
              protocol: i.IpProtocol,
              fromPort: i.FromPort,
              description: description
            }
            entries.push(entry);

          } 
          
          if(i.IpRanges && i.IpRanges.length > 0) {
            for (var k = 0, len = i.IpRanges.length; k < len; k++) {

            let range = i.IpRanges[k];
            name = range.CidrIp;
            if(range.Description){
              description = range.Description;
            }
            let entry = {
              name: name,
              protocol: i.IpProtocol,
              fromPort: i.FromPort,
              description: description
            }
            entries.push(entry);
          }

          }
          return entries;
        });

        var ingress = [].concat(...ingressUnflat);

        let description = '';
        if( sg.Description ){
          description = sg.Description;
        }
        return {
          name: sg.GroupName,
          description: description,
          id: sg.GroupId,
          ingress: ingress
        };
      })
      .value());
  });
  return promise;
};

module.exports = transformPromise;
