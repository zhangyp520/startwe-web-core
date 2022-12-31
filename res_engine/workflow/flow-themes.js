(function($) {
	var FlowUi = $.FlowUi;
	if(!oui.loadStartTime){
		oui.loadStartTime = new Date().getTime();
	}
	$.extend(true, FlowUi.config.tools.states, {
		start: {
			attr:{
				fill : '#73ae42',
				stroke : '',
				r:20
			},
			type: 'start',
			name: {
				text: '<<start>>'
			},
			text: {
				text: '开始'
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		end:{
			attr:{
				fill : '#b7b7b7',
				stroke : '',
				r:40
			},
			type: 'end',
			name: {
				text: ''
			},
			text: {
				//text: 'end',
				fill:'#333'
			},
			img: {
				src: 'img/16/end.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		role:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'role',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		team:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'team',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/team.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		post:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'post',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/post.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		department:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'department',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		all:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'all',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		company:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'company',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		group:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'group',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		level:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'level',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		relativeRole:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'relativeRole',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/relative-role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		'end-cancel': {
			type: 'end-cancel',
			name: {
				text: '<<end-cancel>>'
			},
			text: {
				text: '取消'
			},
			img: {
				src: 'img/16/end_event_cancel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		'end-error': {
			type: 'end-error',
			name: {
				text: '<<end-error>>'
			},
			text: {
				text: '错误'
			},
			img: {
				src: 'img/16/end_event_error.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		state: {
			type: 'state',
			name: {
				text: '<<state>>'
			},
			text: {
				text: ''
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		fork: {
			type: 'fork',
			name: {
				text: '<<fork>>'
			},
			text: {
				text: '分支'
			},
			img: {
				src: 'img/16/gateway_parallel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		join: {
			type: 'join',
			name: {
				text: '<<join>>'
			},
			text: {
				text: '合并'
			},img:{}
		},
		task: {
			type: 'task',
			name: {
				text:''
				//text: '<<task>>'
			},
			text: {
				text: '任务'
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			} 
		},
		decision: {
			type: 'decision',
			name: {
				text: '<<decision>>'
			},
			text: {
				text: '决定'
			},
			img: {
				src: 'img/16/gateway_parallel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			}
		}
	});
	/**
	 * ----------------------------------------------------------------------------
	 流程皮肤样式配置
	 ------------------------------------------------------------------------------
	 */
	
	/**
	 * 显示样式配置
	 */
	FlowUi.themes[1] = { //有底色样式
		tools:{
			states:{

				start: {
					attr:{
						fill : '#73ae42',
						stroke : '',
						r:40
					},
					type: 'start',
					name: {
						text: '<<start>>'
					},
					text: {
						text: '开始',
						fill:'#333'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				end:{
					attr:{
						fill : '#b7b7b7',
						stroke : '',
						r:40
					},
					type: 'end',
					name: {
						text: ''
					},
					text: {
						//text: 'end',
						fill:'#333'
					},
					img: {
						src: 'img/16/end.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				split: {
					attr:{
						fill : '#B7B7B7',
						//stroke : '#5990cf',
						//"stroke-width" : 1 ,
						r:10	,
						width:1,
						height:1
					},
					type: 'split',
					name: {
						text: ''
					},
					text: {
						text: '',
						fill:'#5990cf'
					},
					img:{
					}
				},
				join: {
					attr:{
						fill : '#B7B7B7',
						'fill-opacity':1,
						//stroke : '#5990cf',
						"stroke-width" : 1,
						r:20,
						width:15,
						height:15
					},
					type: 'join',
					name: {
						text: ''
					},
					text: {
						text: '',
						fill:'#ffffff'
					},
					img:{
					}
				},
				task: {
					type: 'task',
					name: {
						text:''
						//text: '<<task>>'
					},
					text: {
						text: '任务'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				role:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'role',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				team:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'team',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/team.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				department:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'department',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				post:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'post',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/post.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				all:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'all',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				company:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'company',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				group:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'group',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				level:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'level',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				relativeRole:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'relativeRole',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/relative-role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				}
			}
		},
		rect : {// 状态
			attr : {
				x : 10,
				y : 10,
				width : 100,
				height : 50,
				r : 40,
				fill : '#5990cf',
				stroke : '',
				"stroke-width" : 1
			},
			showType : 'image&text',// image,text,image&text
			type : 'state',
			name : {
				text : 'state',
				'font-style' : 'normal'
			},
			text : {
				text : '',
				fill:'#000000',
				//'z-index':2,
				'font-size' : 13
			},
			margin : 5,
			props : [],
			img : { }
		},
		path : {// 路径转换
			attr : {
				path : {
					path : 'M10 10L100 100',
					stroke : '#B7B7B7',
					fill : "none", 
					"stroke-width" : 1
				},
				arrow : {
					path : 'M10 10L10 10',
					stroke : '#5990cf',
					fill : "#5990cf",
					"stroke-width" : 1,
					radius : 4
				},
				fromDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				toDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				bigDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				smallDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				text : {
				    cursor : "move",
                    'background' : '#000'
				}
			},
			text : {
				patten : 'TO {to}',
				textPos : {
                    x : 0,
                    y : -10
                }
			},
			props : {
				text : {
					name : 'text',
					label : '显示',
					value : '',
					editor : function() {
						return new FlowUi.editors.textEditor();
					}
				}
			}
		}
	};
	/**
	 * 无底色皮肤
	 */
	FlowUi.themes[2] = {
		tools:{
			states:{
				start: {
					attr:{
						fill : '#f8f8f8',
						stroke : '#929292',
						r:0
					},
					type: 'start',
					name: {
						text: '<<start>>'
					},
					text: {
						text: '开始',
						fill:'#1eb222'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				task: {
					type: 'task',
					name: {
						text:''
						//text: '<<task>>'
					},
					text: {
						text: '任务'
					},
					img: {
						src: 'img/16/task_empty_b.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				}
			}
		},
		rect : {// 状态
			attr : {
				x : 10,
				y : 10,
				width : 100,
				height : 50,
				r : 0,
				fill : '#f8f8f8',
				stroke : '#929292',
				"stroke-width" : 1
			},
			showType : 'image&text',// image,text,image&text
			type : 'state',
			name : {
				text : 'state',
				'font-style' : 'normal'
			},
			text : {
				text : '',
				fill:'#5990cf',
				'font-size' : 13
			},
			margin : 5,
			props : [],
			img : {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		path : {// 路径转换
			attr : {
				path : {
					path : 'M10 10L100 100',
					stroke : '#686868',
					fill : "none",
					"stroke-width" : 1
				},
				arrow : {
					path : 'M10 10L10 10',
					stroke : '#959595',
					fill : "#959595",
					"stroke-width" : 1,
					radius : 4
				},
				fromDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				toDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				bigDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				smallDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				text : {
				    cursor : "move",
                    'background' : '#000'
				}
			},
			text : {
				patten : 'TO {to}',
				textPos : {
                    x : 0,
                    y : -10
                }
			},
			props : {
				text : {
					name : 'text',
					label : '显示',
					value : '',
					editor : function() {
						return new FlowUi.editors.textEditor();
					}
				}
			}
		}
	};
	
})(jQuery);








