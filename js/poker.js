//animate(样式,时间,动画方式,回调函数)
// animate可以链式调用,执行完一个再执行一个

//queue();
// 队列

//dequeue();
//queue()之后要加 出队

//delay();
//stop();
$(function(){
	//生成一副扑克牌
	var cishitishi = $('.cishutishi');
	var right = $('.right');
	var state ;
	right.addClass('shangqu');
	var startFapai = $('.startFapai');
	var tishi = $('.tishi');
	startFapai.on('click',function(e){
		e.preventDefault();
		if($('.poker').length){
				tishi.addClass('move');
				setTimeout(function(){
					tishi.removeClass('move');
				},3000)
				return;
			}else{
				start();
				startTime();
				$('.dangqiantishi').addClass('ss');
				$('.zongtishi').addClass('sss');
				state = 'playing';
			}
	});


	function remove(){
		$('.poker').remove();
	}
	function start(){
		var color = ['h','d','s','c'];
		var dic = {};
		var pokerArr = [];
		var flag= false;
			while(pokerArr.length<52){
				var c = color[Math.floor(Math.random()*4)];
				var n = Math.ceil(Math.random()*13);
				if(!dic[c+'_'+n]){
					pokerArr.push({color:c,number:n});
					dic[c+'_'+n] = true;
				}
			}
		var dics = {
			1:'A',
			2:'2',
			3:'3',
			4:'4',
			5:'5',
			6:'6',
			7:'7',
			8:'8',
			9:'9',
			10:'T',
			11:'J',
			12:'Q',
			13:'K'
		}
		//初始化桌面，发牌

		var index = 0;
		var desk = $('.desk');
		var d = 0;
		var last = null;
		var pokers;
		var shangyige = $('.desk .shangyige');
		var xiayige = $(".desk .xiayige");
		var zIndex = 0;
		var count = 1;

		function isClickable(el){
				var x = parseInt($(el).attr('id').split('_')[0]);
				var y = parseInt($(el).attr('id').split('_')[1]);
				return $('#'+(x+1)+'_'+y).length || $('#'+(x+1)+'_'+(y+1)).length;
			}

			for(var i=0; i<7; i++){
				for(var j=0; j<i+1; j++){
					index += 1;
					d += 60;
					$('<div>')
					.addClass('poker shang')
					.css({
						backgroundImage:'url(puke/'+dics[pokerArr[index].number]+pokerArr[index].color+'.png)'
					})
					.attr('id',i+'_'+j)
					.data('sub',pokerArr[index].number)
					.appendTo(desk)
					.delay(d)
					.animate({
						left: (6-i)*45 +j*90,
						top: i * 60,
						opacity:1
					});
				}
			}
			for(;index<pokerArr.length;index++){
				$('<div>')
					.addClass('poker zuo xia')
					.css({
						backgroundImage:'url(puke/'+dics[pokerArr[index].number]+pokerArr[index].color+'.png)'
					})
					.appendTo(desk)
					.data('sub',pokerArr[index].number)
					.delay(index*60)
					.animate({
						left:150,
						top:490,
						opacity:1
					})
			}

		$('.poker').on('click',function(e){
			e.stopPropagation();
			if($(this).hasClass('shang') && isClickable(this)){
				return;
			}
			if($(this).data('sub') == 13){
				$(this).animate({
					left:600,
					top:0,
					opacity:0
				}).queue(function(){
					$(this).remove().dequeue();
				})
				return;
			}

			$(this).toggleClass('chulie');
			if($(this).hasClass('chulie')){
				$(this).animate({
					top:'-=10'
				})
			}else{
				$(this).animate({
					top:'+=10'
				})
			}

			if( !last){
				last = $(this);
			}else{
				if(last.data('sub') + $(this).data('sub') == 13){
					last.delay(400).animate({
						top:0,
						left:600,
						opacity:0
					}).queue(function(){
						$(this).remove().dequeue();
					});
					$(this).animate({
						top:0,
						left:600,
						opacity:0
					}).queue(function(){
						$(this).remove().dequeue();
					});
					$('.dangqiantishi').html('当前有0对可以匹配');

					last = null;
					if(!$('.shang').length){
						$('.zongtishi span').html('0');
						alert("恭喜你，完成游戏!");
						pauseTime();
						$('.dangqiantishi').removeClass('ss');
						$('.zongtishi').removeClass('sss');
					}
					return;
				}else{
					if(last.hasClass('chulie') && $(this).hasClass('chulie')){
						last.delay(400).animate({
							top:'+=10'
						});
						$(this).animate({
							top:'+=10'
						});
					}


					$('.dangqiantishi').html('当前有0对可以匹配');
					$('.desk .chulie').removeClass('chulie');
					last = null;
					return;
				}
			}
			$(document).on('click',function(e){
				e.stopPropagation();
				if($(last).hasClass('chulie')){
					$(last).animate({
							top:'+=10'
						});
					last = null;
					$('.desk .chulie').removeClass('chulie');
					$('.dangqiantishi').html('当前有0对可以匹配');

				}
				return;
			})

			function pickRightTop(el){
				var zindex = [];
				var max = el[0];
				for(var i=0; i<el.length; i++){
					if($(max).css('zIndex')<$(el[i]).css('zIndex')){
						max = el[i];
					}
				}
				return max;
			}

			var shangpai = $('.shang');
			var xiapai = $('.zuo');
			var leftFrist = $('.zuo').eq(-1);
			var you = $('.you');
			var arr = [];
			var newarr1 = [];
			var newarr = [];
			var jisuan = 0;
			for(var i=0; i<shangpai.length; i++){
				if(!isClickable(shangpai[i])){
					arr.push(shangpai[i]);
					newarr.push(shangpai[i]);
				}
			}
			for(var i=0; i<xiapai.length; i++){
				newarr1.push(xiapai[i]);
			}
			arr.push(leftFrist);
			arr.push(pickRightTop(you));
			for(var i=0; i<arr.length; i++){
				if($(this).attr('id') === $(arr[i]).attr('id')){
					arr.splice(i,1);
				}
				if($(this).data('sub')+$(arr[i]).data('sub') ==  13){
					// console.log('youyidui');
					jisuan+=1;
				}
			}
			$('.dangqiantishi').html('当前有'+(jisuan)+'对可以匹配');
			var zongcishu = 0;
			console.log(newarr);
			for(var i=0;i<newarr.length;i++){
				for(var j=0;j<newarr1.length;j++){
					if($(newarr[i]).data('sub')+$(newarr1[j]).data('sub') == 13){
						zongcishu +=  1;
					}
				}
			}
			$('.zongtishi span').html(zongcishu);
		});

			xiayige.on('click',function(e){
				e.stopPropagation();
				zIndex += 1;
				$('.zuo')
				.eq(-1)
				.animate({
					left:420,
					bottom:150
				})
				.removeClass('zuo')
				.addClass('you')
				.css({
					zIndex:zIndex
				});
			});

			var numb = 3;
			var  spancishu = $('.cishutishi');
			shangyige.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				count += 1;

				if($('.zuo').length){
					count-=1;
					$('.noShang').addClass('show');
					setTimeout(function(){
						$('.noShang').removeClass('show')
					},2000)
					return;
				}
				if(count > 4){
					spancishu.html('没有机会了!');
					$('.cishutishi').addClass('show');
					$('.dangqiantishi').removeClass('ss');
					$('.zongtishi').removeClass('sss');
					setTimeout(function(){
						$('.cishutishi').removeClass('show')
					},2000);
					if(zongcishu == 0){
						alert("youxishibai");
					}
					return;
				}else{
					numb--;
					if(numb == 0){
						spancishu.html('');
					}else{
						spancishu.html('还有'+numb+'次机会');
					}
					$('.cishutishi').addClass('show');
					setTimeout(function(){
						$('.cishutishi').removeClass('show')
					},2000)
				}

				$('.you').each(function(i,el){
					$(this)
					.delay(i*30)
					.animate({
						left:150,
						bottom:150
					})
					.removeClass('you')
					.addClass('zuo')
					.css({
						zIndex:0
					});
				});
			});
			state = 'playing';

		}

		function startTime(){
			clearInterval(tt);
			tt = setInterval(jishi,1000);
		}

		function pauseTime(){
			clearInterval(tt);
		}

		var tt;
		var time=0;
		var min=0;
		var second=0;
		function jishi(){
			if(state=="over"){
				time = 0;
				min=0;
				second=0;
				$(".jishi span").html("0:00");
			}
			time +=1;
			second=time%60;
			if(time%60 == 0){
				min = parseInt(min);
				min += 1;
				min = (min<10)?'0'+min:min;
			}
			second = (second<10)?'0'+second:second;
			// console.log(second+'-'+min);
			$(".jishi span").html(min +':'+second);
			state = 'playing';
		}

		var restratFapai = $('.RestartFapai');
		restratFapai.on('click',function(){
			if(state=='play' || state==undefined){
				alert('还没有开始游戏');
				return ;
			}else if(state=='playing'){
				remove();
				start();
				state='over';
				startTime();
			}
			$('.zongtishi span').html('0');
		});


		var endFapai = $('.endFapai');
		endFapai.on('click',function(){
			jieshu();
			setTimeout(jinggao,800);
		});
		function jieshu(){
			var jieshu = $('.jieshu');
			jieshu.addClass('jie');
		}
		function jinggao(){
			var span = $('.jieshu span');
			var num = 3;
			setInterval(function(){
				num--;
				if(num == 0){
					window.close();
				}
				span.html(num);
			},1000)
		}

		var title = $('.shuoming .title');
		var text = $('.shuoming .text');
		title.on('click',function(){
			text.toggleClass('add');
		});



})