'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('register',['$http',function($http) {
      var registerService = {};
      registerService.post = function(data,callback) {
        $http.post('/api/users', data).success(callback);  
      }
      return registerService;
 }]).factory('login',['$http',function($http) {
      var loginService = {};
      loginService.post = function(data,callback) {
        $http.post('/api/users/login', data).success(callback);  
      }
      return loginService;
 }]).factory('solveService',['$http','Cookies',function($http,Cookies) {
  		$http.defaults.headers.common['Authorization'] = "Basic "+Cookies.getItem('token');
  		return {
  		  put: function (data,callback) {
  				$http.post('/api/solves' , data).success(callback);
  			},
        delete: function (data,callback) {
          $http.delete('/api/solves/'+data.Id).success(callback);
        },
        adjust: function (data,callback) {
          $http.get('/api/solves/alter/'+data.type+"/"+data.status+"/"+data.user+"/"+data.solveId).success(callback);
        },
        stats: function(cubetype,userSession,userid,callback) {
           $http.get('/api/solves/stats/'+cubetype+'/'+userSession+'/'+userid).success(callback);
        }
		}
 }]).factory('getSolves',['$resource','$http','Cookies',function($resource,$http,Cookies) {
 	$http.defaults.headers.common['Authorization'] = "Basic "+Cookies.getItem('token');
    return {
      get: function(type,userSession,callback) {
        //$resource('/api/solves/:type/:userid',{"type":type,"userid":Cookies.getItem('user')},{'query':  {method:'GET', isArray:true}});
       $http.get('/api/solves/'+type+"/"+userSession+"/"+Cookies.getItem('user')).success(callback);
     }
    }
    return FeedService;
}]).factory('profileService',['$q','$resource','$rootScope','$http','Cookies',function($q,$resource,$rootScope,$http,Cookies) {
    $http.defaults.headers.common['Authorization'] = "Basic "+Cookies.getItem('token');
    return {
        get:function(callback) {
            $http.get('/api/profile/'+Cookies.getItem('user')).success(callback);
        },
        put: function (data,callback) {
                $http.post('/api/profile/', data).success(callback);
            }
    }
}]).factory('typeService', function () {
      return {
        getType: function (cube) {
          switch(cube) {
            case "2x2x2":
                return 2;
            case "3x3x3":
                return 3;
            case "4x4x4":
                return 4;
            case "5x5x5":
                return 5;
            case "6x6x6":
                return 6;
            case "7x7x7":
                return 7;
            default: 
                return 0;
            }
          }
      }
}).factory("scrambleService",function() {
var cubeScramble={size:3,seqlen:30,numcub:5,mult:false,cubeorient:false,colorString:"yobwrg",colorList:new Array("y","yellow.jpg","yellow","b","blue.jpg","blue","r","red.jpg","red","w","white.jpg","white","g","green.jpg","green","o","orange.jpg","orange","p","purple.jpg","purple","0","grey.jpg","grey"),colors:new Array,seq:new Array,posit:new Array,flat2posit:null,colorPerm:new Array,setColorPerm:function(){this.colorPerm[0]=new Array(0,1,2,3,4,5);this.colorPerm[1]=new Array(0,2,4,3,5,1);this.colorPerm[2]=new Array(0,4,5,3,1,2);this.colorPerm[3]=new Array(0,5,1,3,2,4);this.colorPerm[4]=new Array(1,0,5,4,3,2);this.colorPerm[5]=new Array(1,2,0,4,5,3);this.colorPerm[6]=new Array(1,3,2,4,0,5);this.colorPerm[7]=new Array(1,5,3,4,2,0);this.colorPerm[8]=new Array(2,0,1,5,3,4);this.colorPerm[9]=new Array(2,1,3,5,4,0);this.colorPerm[10]=new Array(2,3,4,5,0,1);this.colorPerm[11]=new Array(2,4,0,5,1,3);this.colorPerm[12]=new Array(3,1,5,0,4,2);this.colorPerm[13]=new Array(3,2,1,0,5,4);this.colorPerm[14]=new Array(3,4,2,0,1,5);this.colorPerm[15]=new Array(3,5,4,0,2,1);this.colorPerm[16]=new Array(4,0,2,1,3,5);this.colorPerm[17]=new Array(4,2,3,1,5,0);this.colorPerm[18]=new Array(4,3,5,1,0,2);this.colorPerm[19]=new Array(4,5,0,1,2,3);this.colorPerm[20]=new Array(5,0,4,2,3,1);this.colorPerm[21]=new Array(5,1,0,2,4,3);this.colorPerm[22]=new Array(5,3,1,2,0,4);this.colorPerm[23]=new Array(5,4,3,2,1,0)},init:function(e){for(var t in e){this[t]=e[t]}this.setColorPerm();this.buildColors()},buildColors:function(){for(var e=0;e<6;e++){this.colors[e]=this.colorList.length-3;for(var t=0;t<this.colorList.length;t+=3){if(this.colorString.charAt(e)==this.colorList[t]){this.colors[e]=t;break}}}},appendmoves:function(e,t,n,r){for(var i=0;i<n;i++){if(t[i]){var s=t[i]-1;var o=r;var u=i;if(i+i+1>=n){o+=3;u=n-1-u;s=2-s}e[e.length]=(u*6+o)*4+s}}},getScramble:function(e){var t="wogyrb";var n;switch(e){case"2x2x2":n={size:2,seqlen:9,numcub:1,colorString:t};break;case"3x3x3":n={size:3,seqlen:30,numcub:1,colorString:t};break;case"4x4x4":n={size:4,seqlen:40,numcub:1,colorString:t};break;case"5x5x5":n={size:5,seqlen:60,numcub:1,colorString:t};break;case"6x6x6":n={size:6,seqlen:80,numcub:1,colorString:t};break;case"7x7x7":n={size:7,seqlen:100,numcub:1,colorString:t};break;case"8x8x8":n={size:8,seqlen:100,numcub:1,colorString:t};break;case"9x9x9":n={size:9,seqlen:100,numcub:1,colorString:t};break;case"10x10x10":n={size:10,seqlen:100,numcub:1,colorString:t};break;case"11x11x11":n={size:11,seqlen:100,numcub:1,colorString:t};break;default:n={size:3,seqlen:25,numcub:1,colorString:t}}this.scramble(n);return{string:this.scramblestring(0),image:this.imagestring(0)}},scramble:function(e){this.init(e);var t=this.size;if(this.mult||(this.size&1)!=0)t--;var n=new Array(t);var r=new Array(0,0,0);var i;for(var s=0;s<this.numcub;s++){i=-1;this.seq[s]=new Array;for(var o=0;o<t;o++)n[o]=0;r[0]=r[1]=r[2]=0;var u=0;while(this.seq[s].length+u<this.seqlen){var a,f,l;do{do{a=Math.floor(Math.random()*3);f=Math.floor(Math.random()*t);l=Math.floor(Math.random()*3)}while(a==i&&n[f]!=0)}while(a==i&&!this.mult&&t==this.size&&(2*r[0]==t||2*r[1]==t||2*r[2]==t||2*(r[l]+1)==t&&r[0]+r[1]+r[2]-r[l]>0));if(a!=i){this.appendmoves(this.seq[s],n,t,i);for(var o=0;o<t;o++)n[o]=0;r[0]=r[1]=r[2]=0;u=0;i=a}r[l]++;u++;n[f]=l+1}this.appendmoves(this.seq[s],n,t,i);this.seq[s][this.seq[s].length]=this.cubeorient?Math.floor(Math.random()*24):0}this.flat2posit=new Array(12*this.size*this.size);for(o=0;o<this.flat2posit.length;o++)this.flat2posit[o]=-1;for(o=0;o<this.size;o++){for(var c=0;c<this.size;c++){this.flat2posit[4*this.size*(3*this.size-o-1)+this.size+c]=o*this.size+c;this.flat2posit[4*this.size*(this.size+o)+this.size-c-1]=(this.size+o)*this.size+c;this.flat2posit[4*this.size*(this.size+o)+4*this.size-c-1]=(2*this.size+o)*this.size+c;this.flat2posit[4*this.size*o+this.size+c]=(3*this.size+o)*this.size+c;this.flat2posit[4*this.size*(this.size+o)+2*this.size+c]=(4*this.size+o)*this.size+c;this.flat2posit[4*this.size*(this.size+o)+this.size+c]=(5*this.size+o)*this.size+c}}},scramblestring:function(e){var t="",n;for(var r=0;r<this.seq[e].length-1;r++){if(r!=0)t+=" ";var i=this.seq[e][r]>>2;n=i%6;i=(i-n)/6;if(i&&this.size<=5&&!this.mult){t+="dlburf".charAt(n)}else{if(this.size<=5&&this.mult){t+="DLBURF".charAt(n);if(i)t+="w"}else{if(i)t+=i+1;t+="DLBURF".charAt(n)}}n=this.seq[e][r]&3;if(n!=0)t+=" 2'".charAt(n)}if(this.cubeorient){var s=this.seq[e][this.seq[e].length-1];t="Top:"+this.colorList[2+this.colors[this.colorPerm[s][3]]]+"&nbsp;&nbsp;&nbsp;Front:"+this.colorList[2+this.colors[this.colorPerm[s][5]]]+"<br>"+t}return t},imagestring:function(e){var t="",n,r,i=0,s;for(n=0;n<6;n++)for(r=0;r<this.size*this.size;r++)this.posit[i++]=n;for(n=0;n<this.seq[e].length-1;n++){s=this.seq[e][n]&3;r=this.seq[e][n]>>2;i=0;while(r>5){r-=6;i++}do{this.doslice(r,i,s+1);i--}while(this.mult&&i>=0)}var o=this.seq[e][this.seq[e].length-1];i=0;var u=300;var a=Math.floor(u/(this.size*3));if(a<5){a=5}var t={};t.width=a*this.size*4;t.height=a*this.size*3;t.block=[];for(n=0;n<3*this.size;n++){var f=[];for(r=0;r<4*this.size;r++){var l;var c;var h;var p=false;if(this.flat2posit[i]<0){l=a;c=a*1-2}else{var d=this.colorPerm[o][this.posit[this.flat2posit[i]]];l=a*1-2;c=a*1-2;h=this.colorList[this.colors[d]+1];p=true}f.push({height:a,width:c,showColor:p,color:h});i++}t.block.push({height:a,width:a*this.size*4,stickers:f})}return t},doslice:function(e,t,n){var r,i,s,o;var u=this.size*this.size;var a,f,l,c;if(e>5)e-=6;for(c=0;c<n;c++){for(f=0;f<this.size;f++){if(e==0){r=6*u-this.size*t-this.size+f;i=2*u-this.size*t-1-f;s=3*u-this.size*t-1-f;o=5*u-this.size*t-this.size+f}else if(e==1){r=3*u+t+this.size*f;i=3*u+t-this.size*(f+1);s=u+t-this.size*(f+1);o=5*u+t+this.size*f}else if(e==2){r=3*u+t*this.size+f;i=4*u+this.size-1-t+this.size*f;s=t*this.size+this.size-1-f;o=2*u-1-t-this.size*f}else if(e==3){r=4*u+t*this.size+this.size-1-f;i=2*u+t*this.size+f;s=u+t*this.size+f;o=5*u+t*this.size+this.size-1-f}else if(e==4){r=6*u-1-t-this.size*f;i=this.size-1-t+this.size*f;s=2*u+this.size-1-t+this.size*f;o=4*u-1-t-this.size*f}else if(e==5){r=4*u-this.size-t*this.size+f;i=2*u-this.size+t-this.size*f;s=u-1-t*this.size-f;o=4*u+t+this.size*f}a=this.posit[r];this.posit[r]=this.posit[i];this.posit[i]=this.posit[s];this.posit[s]=this.posit[o];this.posit[o]=a}if(t==0){for(f=0;f+f<this.size;f++){for(l=0;l+l<this.size-1;l++){r=e*u+f+l*this.size;s=e*u+(this.size-1-f)+(this.size-1-l)*this.size;if(e<3){i=e*u+(this.size-1-l)+f*this.size;o=e*u+l+(this.size-1-f)*this.size}else{o=e*u+(this.size-1-l)+f*this.size;i=e*u+l+(this.size-1-f)*this.size}a=this.posit[r];this.posit[r]=this.posit[i];this.posit[i]=this.posit[s];this.posit[s]=this.posit[o];this.posit[o]=a}}}}}}
        //End Scramble
        return cubeScramble;
});