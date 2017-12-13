angular.module('eagledreamApp').controller('mainpageController', ['$scope', '$http', function($scope, $http){

//Variable Declarations
    $scope.realmList = [];
    $scope.accessToken = "";
    $scope.showBoard = false;
    $scope.charName = "";
    $scope.selectedRealm = "";

    $scope.requestedCharacter = {
        level: 0,
        thumbnail: "",
        health: 0,
        Attributes: {
            strength: 0,
            agility: 0,
            intelligence: 0,
            stamina: 0,
        },
        Attack: {
            damage: 0,
            speed: 0
        },
        Defense: {
            armor: 0,
            dodge: 0,
            parry: 0,
            block: 0
        },
        Enhancements: {
            crit: 0,
            haste: 0,
            mastery: 0,
            leech: 0,
            versatility: 0
        },
        Items: {
            helm: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            chest: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            shoulders: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            legs: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            feet: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            trinket: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0},
            back: {id: 0, name: "--", requiredLevel: 0, sellPrice: 0, buyPrice: 0}
        }
    }


//Functions
    $scope.fetchAccessToken = function(){
        $http.get('/getToken')
        .then(function(response) {
            $scope.accessToken = response.data;
            $scope.loadRealms();
        });
    }

    $scope.loadRealms = function (){
        var container = {token: $scope.accessToken};
        $http.post('/loadRealms', container)
        .then(function(response) {
            for(var i = 0; i < response.data.length; i++){
                var obj = {name: response.data[i].name, id: response.data[i].id};
                $scope.realmList.push(obj);
            }
        });    
    }
   
    $scope.searchCharacter = function(){
        if(typeof $scope.charName === "undefined" || $scope.charName.includes(";") || typeof $scope.selectedRealm === "undefined"){
            alert("Please enter a valid Character Name and Realm.")
        } else {
            var request = {name: $scope.charName, realm: $scope.selectedRealm};    
            $http.post('/searchCharacter', request)
            .then(function(response) {
                //Set all the characteristics of the character and their items
                $scope.requestedCharacter.level = response.data.level;
                $scope.requestedCharacter.thumbnail = response.data.thumbnail; 
                $scope.requestedCharacter.health = response.data.stats.health;  
                $scope.requestedCharacter.Attributes.strength = response.data.stats.str;
                $scope.requestedCharacter.Attributes.agility = response.data.stats.agi;
                $scope.requestedCharacter.Attributes.intelligence = response.data.stats.int;
                $scope.requestedCharacter.Attributes.stamina = response.data.stats.sta;
                $scope.requestedCharacter.Defense.armor = response.data.stats.armor;    
                $scope.requestedCharacter.Defense.dodge = response.data.stats.dodgeRating.toFixed(2);       
                $scope.requestedCharacter.Defense.parry = response.data.stats.parryRating.toFixed(2);       
                $scope.requestedCharacter.Defense.block = response.data.stats.blockRating.toFixed(2);
                $scope.requestedCharacter.Enhancements.crit = response.data.stats.crit.toFixed(2); 
                $scope.requestedCharacter.Enhancements.haste = response.data.stats.haste.toFixed(2);       
                $scope.requestedCharacter.Enhancements.mastery = response.data.stats.mastery.toFixed(2);       
                $scope.requestedCharacter.Enhancements.leech = response.data.stats.leech.toFixed(2);       
                $scope.requestedCharacter.Enhancements.versatility = response.data.stats.versatility.toFixed(2); 
                $scope.requestedCharacter.Items.helm.id = response.data.items.head.id;
                $scope.requestedCharacter.Items.helm.name = response.data.items.head.name;
                $scope.requestedCharacter.Items.chest.id = response.data.items.chest.id;
                $scope.requestedCharacter.Items.chest.name = response.data.items.chest.name;
                $scope.requestedCharacter.Items.shoulders.id = response.data.items.shoulder.id;
                $scope.requestedCharacter.Items.shoulders.name = response.data.items.shoulder.name;
                $scope.requestedCharacter.Items.legs.id = response.data.items.legs.id;
                $scope.requestedCharacter.Items.legs.name = response.data.items.legs.name;
                $scope.requestedCharacter.Items.feet.id = response.data.items.feet.id;
                $scope.requestedCharacter.Items.feet.name = response.data.items.feet.name;
                $scope.requestedCharacter.Items.trinket.id = response.data.items.trinket1.id;
                $scope.requestedCharacter.Items.trinket.name = response.data.items.trinket1.name;
                $scope.requestedCharacter.Items.back.id = response.data.items.back.id;
                $scope.requestedCharacter.Items.back.name = response.data.items.back.name;

                //Queries for extra item info
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.helm.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.helm.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.helm.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.helm.buyPrice = response.data.buyPrice;                 
                });     
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.chest.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.chest.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.chest.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.chest.buyPrice = response.data.buyPrice;                 
                });     
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.shoulders.id)
                .then(function(response) {
                    $scope.requestedCharacter.Items.shoulders.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.shoulders.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.shoulders.buyPrice = response.data.buyPrice;            
                });  
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.legs.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.legs.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.legs.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.legs.buyPrice = response.data.buyPrice;                 
                });     
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.feet.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.feet.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.feet.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.feet.buyPrice = response.data.buyPrice;                 
                });     
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.trinket.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.trinket.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.trinket.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.trinket.buyPrice = response.data.buyPrice;                 
                });     
                $http.post('/getItemInfo/' + $scope.requestedCharacter.Items.back.id)
                .then(function(response) {            
                    $scope.requestedCharacter.Items.back.requiredLevel = response.data.requiredLevel;
                    $scope.requestedCharacter.Items.back.sellPrice = response.data.sellPrice;                    
                    $scope.requestedCharacter.Items.back.buyPrice = response.data.buyPrice;                 
                });     
                //If the infoBoard has been closed or if the page is "fresh", show the board.
                if($scope.showBoard !== true){
                    $scope.showBoard = true;
                }
            });
        }
    }

    $scope.closeInfoBoard = function() {
        $scope.showBoard = false;
    }
}]);