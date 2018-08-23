var app = angular.module('angularapp',['ngRoute']);

app.config(function($routeProvider){
	$routeProvider.when(('/'),{
		template:`
			<h1>Welcome to Notebook Messenger Application!</h1>
		`,
		resolve:['authservice',function(authservice){
			return authservice.checklogin();
		}]
	})
	
	.when(('/loginpage'),{
	templateUrl:'loginpage.html',
	controller:'loginctrl',
	
	
	})

	.when(('/signup'),{
	templateUrl:'signuppage.html',
	controller: 'signupCtrl'
	})

	.when(('/profile'),{
	templateUrl:'profile.html',
	controller:'profilectrl',
	resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]
		
	})
	.when(('/messages'),{
	templateUrl:'msg.html',
	controller:'msgctrl',
	resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]	
	})
	.when(('/messages/:uId'),{
		templateUrl:'msgdetail.html',
		controller:'msgdetailctrl',
	resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]	
	})
	.when(('/logout'),{
		redirectTo:'/loginpage',
		controller:'logoutcntrl',
		resolve:['authservice',function(authservice){
			return authservice.checklogin();
		}]
	})
	.otherwise({
		redirectTo:'/'
		})


});
app.factory('authservice',function($location){
	return{
		'checklogin': function(){
			if(!localStorage.isLoggedIn || localStorage.isLoggedIn=="false")
			{
				$location.path('/loginpage');
				return false;
			}
			return true;
		}
	};
});

app.controller('loginctrl',function($scope,$location,$rootScope){
	$scope.authform = {};
	localStorage.isLoggedIn=false;
	$scope.login = function(){
		$scope.username= $scope.authform.uname;
		$scope.password= $scope.authform.pwd;
		var users=[];
		if(localStorage.userdata){
			users=JSON.parse(localStorage.userdata);
			for (let i=0;i<users.length;i++)
			{
				if ($scope.username==users[i].Username && $scope.password==users[i].Password){
					alert("welcome!!");
					localStorage.ind=i;
					localStorage.username=$scope.username;
					localStorage.isLoggedIn=true;
					$location.path('/');
					$rootScope.$broadcast('isLoggedIn', localStorage.isLoggedIn);
				}
			}
			if(localStorage.isLoggedIn=="false"){
				alert("Invalid details");
				return false;
			}	
		}
	}
});

app.controller('signupCtrl',function($scope,$location){
	$scope.register = function(){
		var users=[];
		if(localStorage.userdata){
			users=JSON.parse(localStorage.userdata);
		}
		users.push({Username:$scope.uname, Password:$scope.pwd, Firstname:$scope.fname, Lastname:$scope.lname,Email:$scope.email,Phone:$scope.num,Location:$scope.loc});
		localStorage.userdata=JSON.stringify(users);
		$location.path('/loginpage');
	}	
});

app.controller('logoutcntrl', function($rootScope){
	localStorage.setItem('isLoggedIn',false);
})

app.controller('profilectrl', function($scope,$location){
	$scope.users=[];
	if(localStorage.userdata){
		$scope.users=JSON.parse(localStorage.userdata);
	}
	$scope.username=$scope.users[localStorage.ind].Username;
	$scope.password=$scope.users[localStorage.ind].Password;
	$scope.firstname=$scope.users[localStorage.ind].Firstname;
	$scope.lastname=$scope.users[localStorage.ind].Lastname;
	$scope.email=$scope.users[localStorage.ind].Email;
	$scope.location=$scope.users[localStorage.ind].Location;
	$scope.phone=$scope.users[localStorage.ind].Phone;

	$scope.update=function(){
		$scope.users[localStorage.ind].Username=$scope.username;
		$scope.users[localStorage.ind].Password=$scope.password;;	
		$scope.users[localStorage.ind].Firstname=$scope.firstname;
		$scope.users[localStorage.ind].Lastname=$scope.lastname;
		$scope.users[localStorage.ind].Email=$scope.email;
		$scope.users[localStorage.ind].Location=$scope.location;
		$scope.users[localStorage.ind].Phone=$scope.phone;
		localStorage.userdata=JSON.stringify($scope.users);
		alert("updated");
		$location.path('/messages');
	}	
})

app.controller('msgctrl', function($scope){
	$scope.mesgArr=[
		{
            "recipient":"nikki95",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"hari",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"hello",
            "description":"How are you?",
            "created_at":"2017-01-19 09:45:00",
			"important":"0",
			"replies":[]
        },
        {
            "recipient":"bebo",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"nikki",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"heyy",
            "description":"How are you bebo?",
            "created_at":"2017-01-19 09:45:00",
			"important":"1",
			"replies":[]
        },
        {
            "recipient":"nikki95",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"nikki",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"goodnight",
            "description":"Happy weekend?",
            "created_at":"2017-01-19 09:45:00",
			"important":"1",
			"replies":[]
		}];
	if(localStorage.messages){
		$scope.mesgArr=JSON.parse(localStorage.messages);
	}
	localStorage.messages=JSON.stringify($scope.mesgArr);	
	$scope.message1=[];
	$scope.trackind=[];
	for(let x=0;x<$scope.mesgArr.length;x++){
		if(localStorage.username==$scope.mesgArr[x].recipient){
			$scope.trackind.push({x});
			$scope.message1.push($scope.mesgArr[x]);
		}
	}
	localStorage.submsg=JSON.stringify($scope.message1);
	localStorage.tind=JSON.stringify($scope.trackind);	
});

app.controller('msgdetailctrl',function($scope,$rootScope,$location,$routeParams){
	$scope.message1=JSON.parse(localStorage.submsg);
	$scope.tindex=JSON.parse(localStorage.tind);
	$scope.msg_detail=$scope.message1[$routeParams.uId];
	$scope.mesgArr=[];
	if(localStorage.messages){
		$scope.mesgArr=JSON.parse(localStorage.messages);

	$scope.reply=function(){
		$scope.msg_detail.replies.push({From:localStorage.username, Reply:$scope.replymsg});
		$scope.mesgArr[$scope.tindex[$routeParams.uId].x].replies.push({From:localStorage.username, Reply:$scope.replymsg});
		localStorage.messages=JSON.stringify($scope.mesgArr);
	}
	
	$scope.takeback=function(){
		$location.path('/messages')
	}

	$scope.del=function(){
		$scope.mesgArr.splice($scope.tindex[$routeParams.uId].x,1);
		localStorage.messages=JSON.stringify($scope.mesgArr);
		$location.path('/messages');
	}

	$scope.imp=function(){
			if($scope.mesgArr[$scope.tindex[$routeParams.uId].x].important=="0"){
				$scope.msg_detail.important="1";
				$scope.mesgArr[$scope.tindex[$routeParams.uId].x].important="1";
				localStorage.messages=JSON.stringify($scope.mesgArr);
				localStorage.messages=JSON.stringify($scope.mesgArr);	
			}
			else{
				$scope.msg_detail.important="0";
				$scope.mesgArr[$scope.tindex[$routeParams.uId].x].important="0";
				localStorage.messages=JSON.stringify($scope.mesgArr);
			}
			
	}		
	}
});

app.controller('appController',function($scope,authservice,$rootScope){
	$scope.userstatus = localStorage.isLoggedIn;
	$rootScope.$on('isLoggedIn', function(event, args) {
		$scope.userstatus = args;
		console.log($scope.userstatus);
	});

});