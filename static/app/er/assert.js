define("er/assert",function(){
	if(window.DEBUG){
		var e=function(e,t){if(!e)throw new Error(t)};
		return e.has=function(t,r){e(null!=t,r)},e.equals=function(t,r,n){e(t===r,n)},e.hasProperty=function(t,r,n){e(null!=t[r],n)},e.lessThan=function(t,r,n){e(r>t,n)},e.greaterThan=function(t,r,n){e(t>r,n)},e.lessThanOrEquals=function(t,r,n){e(r>=t,n)},e.greaterThanOrEquals=function(t,r,n){e(t>=r,n)},e
	}
	var e=function(){};
	return e.has=e,e.equals=e,e.hasProperty=e,e.lessThan=e,e.greaterThan=e,e.lessThanOrEquals=e,e.greaterThanOrEquals=e,
	e
});