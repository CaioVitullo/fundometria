function dataManager($http, me){
    me.getFile = function(url, fileIndex , after){
		//var url = me.getRoot('resultado') + 'cursos/file_' + courses[index] + '.txt';
		try {
			var ajaxConfig = { url: url, cache: false };
			ajaxConfig.method = 'GET';
			ajaxConfig.cache = false;
			ajaxConfig.params = {_t : new Date().getTime()};
			$http(ajaxConfig).then(function (result, status) {
				me.defaultLists[fileIndex]=result.data;
                if(typeof(after)=='function')
                    after();
			});
		} catch (error) {
			
		}
		 
    };
    me.defaultFiles = [
		{index:1, name:'last24'},
		{index:2, name: 'last36'},
		{index:3, name:'bigList'},
		{index:0, name: 'last12'}];

	me.defaultLists = [];
	me.getDefaultLists = function(fn, afterBigList){
		
		for(i=0;i<me.defaultFiles.length;i++){
			var file = me.defaultFiles[i].name;
			var index = me.defaultFiles[i].index;
			var url = 'resultadoFundo/' + file + '.txt';
			if(me.defaultFiles[i].name =='bigList'){
				me.getFile(url, index, afterBigList);
			}else if(me.defaultFiles[i].name =='last24'){
				me.getFile(url, index, fn);
			}else{
				me.getFile(url, index, null);
			}
			
		}
	};
	me.getGenericFile = function(url, after){
		try {
			var ajaxConfig = { url: url, cache: false };
			ajaxConfig.method = 'GET';
			ajaxConfig.cache = false;
			ajaxConfig.params = {_t : new Date().getTime()};
			$http(ajaxConfig).then(function (result, status) {
				after(result.data);
			});
		} catch (error) {
			
		}
    }
    me.saveOnStorage = function(key, obj){
		
		if(typeof(localStorage) == 'object'){
			value = JSON.stringify(obj);
			localStorage.setItem(key, value);
			return true;
		}
		return false;
	};
	me.getFromStorage = function(key){
		if(typeof(localStorage) == 'object'){
			value =localStorage.getItem(key);
			return JSON.parse(value);
		}
		return null;
	};
	
	me.getQuerystring = function (name, _url) {
        var url = _url != null ? _url : window.location.href;
        if (url.indexOf('?') >= 0) {
            var parte = url.split('?')[1].split('#')[0];
            if (parte.indexOf('&') >= 0) {
                var retorno = '';
                $(parte.split('&')).each(function (index, item) {
                    var chaveValor = item.split('=');
                    if (chaveValor[0] == name) {
                        retorno = chaveValor[1];
                        return false;
                    }
                });
                return retorno;
            } else {
                if (parte.indexOf('=') >= 0 && parte.split('=')[0] == name) {
                    var str = parte.split('=')[1];
                    return str.split('#')[0];
                }
            }
        }
    };
    me.hasBeenShowed = function(name){
        var storage = me.getFromStorage(name);
        if(storage == null)
            return false;
        return storage.value;
    };
    me.canShowFeature = function(key){
        if(me.hasBeenShowed(key) == false){
            me.saveOnStorage(key, {value:true});
            return true;
        }
        return false;
	};
	me.textDialogHtml = '';
	me.titleDialogHtml = '';
	me.showCustomDialog = function(title, html){
		me.textDialogHtml = html;
		me.titleDialogHtml = title;
		$('#modalCustomText').modal('open');
	};
	me.rankingFullList = null
	me.showRankDialog = function(){
		if(me.rankingFullList ==null){
			me.rankDataIsLoading = true;
			me.getGenericFile('resultadoFundo/rankingByMonth.txt', function(result){
				me.rankDataIsLoading = false;
				me.rankingFullList  = result;
			});
		}
		
		
		$('#modalRankingDialog').modal('open');
	}
	me.currentSortCol = 0;
	me.sortReverse = false;
	me.setCurrentSort = function(i){
		if(me.currentSortCol == i){
			me.sortReverse = !me.sortReverse;
		}else{
			me.currentSortCol = i;
		}
	};
	me.ranktableColumns=[0,1,2,3,4,5,6,7,8,9];
	me.showNextRankTableColumns = true;
	me.showPrevtRankTableColumns = false;
	me.nextRankTableColumns = function(){
		var min = me.ranktableColumns.min();
		var max = me.ranktableColumns.max();
		min += 1;
		max += 1;
		
		me.showPrevtRankTableColumns = min>0;	
		me.showNextRankTableColumns = max < 20;

		if(max==20){
			return;
		}

		me.ranktableColumns=[];
		for(var i=min;i<=max;i++){
			me.ranktableColumns.push(i);
		}
	};
	me.prevRankTableColumns = function(){
		var min = me.ranktableColumns.min();
		var max = me.ranktableColumns.max();
		
		min -= 1;
		max -= 1;
		me.showPrevtRankTableColumns = min>0;	
		me.showNextRankTableColumns = max < 20;
		if(min==-1){
			return;
		}
		me.ranktableColumns=[];
		for(var i=min;i<=max;i++){
			me.ranktableColumns.push(i);
		}
	};
	me.sortColumns = [
		'rank',
		'name',	//1
		'posNegCountRate', //2
		'posNegAvgRate',	//3
		'average',			//4
		'volatilidadeAnual',			//5
		'sharpCDI',	//6
		'admTax',			//7
		'performance'		//8
	];
}