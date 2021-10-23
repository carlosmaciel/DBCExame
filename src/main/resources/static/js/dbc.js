<<<<<<< HEAD
$( document ).ready(function() {
	$(".container").hide();
	$("#container-home").show();
	$('#li-home').addClass('active');
	$(".alert").hide();
	$(".alert label").html("");
	
    $("#li-home a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-home').addClass('active');

		$(".container").hide();
		$("#container-home").show();
		
		event.preventDefault();
	});
	
	$("#li-list-pautas a").click(function (event) {		
		$('.nav .active').removeClass('active');
  		$('#li-list-pautas').addClass('active');
		
		console.log("######Buscando no banco todas as pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-pautas tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td></tr>";
					$('#grid-pautas').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-pautas").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
		
		event.preventDefault();
	});
	
	$("#li-list-associados a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-list-associados').addClass('active');

		findAllAssociados();
		
		event.preventDefault();
	});
	
	$("#li-votacao a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-votacao').addClass('active');
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		
		var cookie = $.cookie('timesession');
		if(cookie != null || cookie != undefined) {
			//Há uma sessão aberta!
			$(".container").hide();
			$("#container-sessao").show();
			$("#area-votacao").show();			
			$("#area-finalizar").hide();
			
			popularComboAssociados();
		
			var dateCookie = new Date(cookie.split(";")[0]);
			var nomePauta = cookie.split(";")[2];
			var idPauta = parseInt(cookie.split(";")[1]);

			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	
			
			//iniciando cronometro
			dispararCronometro(dateCookie);			
			
		} else {
			$(".container").hide();
			$("#container-votacao").show();
		}
		
		populateComboPautas();
		
		event.preventDefault();
	});
	
	$("#btn-abrir-sessao").click(function (event) {
		
		$(".container").hide();
		$("#container-sessao").show();		
		$("#area-finalizar").hide();
		$("#area-votacao").show();
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		
		popularComboAssociados();
		
		var dateCron = null;
				
		var cookie = $.cookie('timesession');
		if(cookie != null || cookie != undefined) {
			//Há uma sessão aberta!
			var dateCookie = new Date(cookie.split(";")[0]);
			var nomePauta = cookie.split(";")[2];
			var idPauta = parseInt(cookie.split(";")[1]);
			
			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	

			dateCron = dateCookie;
				
		} else {
			var sessao = parseInt($("#tempo-sessao").val());
			
			sessao = (sessao == null || sessao == 0 || isNaN(sessao)) ? 1 : sessao;
			
			var date = new Date();
			date.setMinutes(date.getMinutes() + sessao);
			
			var nomePauta = $("#cmb-pauta option:selected").text();
			var idPauta = $("#cmb-pauta option:selected").val();
			
			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	
		
			//remover cookie
			$.removeCookie('timesession', { path: '/' });
			
			//iniciando cookie para que o cronometro se mantenha mesmo que a página se feche
			$.cookie('timesession', date + ";" + idPauta + ";" + nomePauta, { expires: date, path: '/' });
						
			dateCron = date;
		}
		
		//iniciando cronometro
		dispararCronometro(dateCron);
		
		event.preventDefault();
	});
	
	function dispararCronometro(date) {
		$("#lbl-clock").show();
		$('div#clock').countdown(date)
			.on('update.countdown', function(event) {
				var $this = $(this);
				$this.html(event.strftime('<span>%H:%M:%S</span>'));
		  	}).on('finish.countdown', function(event) {
				finalizarVotacao($(this));
		  	});
	}
	
	function finalizarVotacao(elem) {
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		$("#lbl-clock").hide();
		elem.html("<label id='encerrada'>A vota&ccedil;&atilde;o est&aacute; encerrada!</label>");
		
		elem.countdown('stop');
		$.removeCookie('timesession', { path: '/' });
		
		var idPauta = $("#id-pauta-sessao").val();
				
		$("#area-votacao").hide();
		$("#area-finalizar").show();
	}
	
	$("#btn-resultado").click(function () {
		hideAlert(".alert-voto-falha");	
		hideAlert(".alert-voto-sucesso");	
		
		var idPauta = $("#id-pauta-sessao").val();
		informarResultado(idPauta);
	});
	
	function informarResultado(idPauta) {
		console.log("###### Informando resultado!");
		$.ajax({
		    url: '/dbc/votacoes/informarResultado/' + idPauta,
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {	
				var sim = data.sim;
				var nao = data.nao;
				
				$("#lbl-voto-sim").html("Contagem de votos SIM: " + sim);
				$("#lbl-voto-nao").html("Contagem de votos SIM: " + nao);
				
				if(sim > nao) {
					console.log("###### O voto vencedor foi: SIM.");
					$("#lbl-resultado").html("O voto vencedor foi: SIM.");
				} else if (nao > sim) {
					console.log("###### O voto vencedor foi: N&Atilde;O.");
					$("#lbl-resultado").html("O voto vencedor foi: N&Atilde;O.");
				} else {
					console.log("###### A vota&ccedil;&atilde;o terminou em empate!");
					$("#lbl-resultado").html("A vota&ccedil;&atilde;o terminou em empate!");
				}							
						
				$("#resultado").fadeIn();				
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	$("#btn-encerrar").click(function (event) {
		finalizarVotacao($("div#clock"));
	});
	
	$("#btn-nova-sessao").click(function (event) {
		hideAlert(".alert-voto-sucesso");				
		$("#li-votacao a").click();
	});
	
	$("#btn-votar").click(function (event) {
		hideAlert(".alert-voto-sucesso");				
		
		var nomePauta = $("#cmb-pauta option:selected").text();
		var idPauta = $("#id-pauta-sessao").val();
		
		var nomeAssociado = $("#cmb-voto-associado option:selected").text();
		var idAssociado = $("#cmb-voto-associado option:selected").val();
		var cpfAssociado = $("#cmb-voto-associado option:selected").attr("cpf");
		
		var voto = $("input[name='radio-voto']:checked"). val();
		
		var data2 = {"pauta": "{id: " + idPauta + ", nome: " + nomePauta + "}",
			"associado": "{id: " + idAssociado + ", nome: " + nomeAssociado + ", cpf: " + cpfAssociado + "}", 
			"voto": voto
		};
		
		var data = JSON.stringify({
			pauta : {id: idPauta, nome: nomePauta}, 
			associado : {id : idAssociado, nome : nomeAssociado, cpf : cpfAssociado}, 
			voto: voto
		});		
		
		votar(cpfAssociado, data);
	});
	
	$("#btn-add-pauta").click(function (event) {
		$(".container").hide();
		$("#container-pauta").show();
		
		$("#campos-pauta input").val(null);
		
		event.preventDefault();
	});
	
	$("#btn-add-associado").click(function (event) {
		$(".container").hide();
		$("#container-associado").show();
		
		$("#campos-associado input").val(null);
		
		event.preventDefault();
	});
	
	$("#btn-salvar-associado").click(function (event) {
		
		hideAlert(".container-associado .alert-voto-falha");

		var cpf = $("#cpf").val();

		validarCpfAntesSalvarAssociado(cpf);
		
		event.preventDefault();
	});
	
	$("#btn-salvar-pauta").click(function (event) {
		
		console.log("###### Salvando pauta.");
		$.ajax({
		    url: '/dbc/pautas/',
			data: JSON.stringify({nome: $("#nome-pauta").val()}),
		    type: 'POST',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {
			findAllPautas();
			console.log("###### Pauta salva.");
		    $(".container").hide();
			$("#container-list-pautas").show();
			
			$(".alert-pauta").fadeIn();
			
		}).fail(function(response) {
			console.log("###### Erro ao salvar pauta: " + response.responseText);
		    alert(response.responseText, null, "Erro");
		});
		
		event.preventDefault();
	});
	
	function salvarAssociado() {
		console.log("###### Salvando associado.");
		$.ajax({
		    url: '/dbc/associados/',
			data: JSON.stringify({"nome": $("#nome-associado").val(), "cpf": $("#cpf").val()}),
		    type: 'POST',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {
			findAllAssociados();
			
			console.log("###### Associado salvo.");
			
		    $(".container").hide();
			$("#container-list-associados").show();
			
			$(".alert-associado").fadeIn();
			
		}).fail(function(response) {
			console.log("###### Erro ao salvar associado: " + response.responseText);
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function validarCpfAntesSalvarAssociado(cpf) {
		console.log("###### Validando CPF antes de salvar associado.");
		$.ajax({
		    url: 'https://user-info.herokuapp.com/users/' + cpf,
			crossDomain: true,
		    type: 'GET',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {	
			
			if(data != null) {
				console.log("###### CPF válido.");
				salvarAssociado();
			} else {
				hideAlert(".alert-voto-sucesso");	
				console.log("###### Interface de valida&ccedil;&atilde;o de CPF com problemas.");
				showAlert(".alert-voto-falha", "Interface de valida&ccedil;&atilde;o de CPF com problemas.");
			}

		}).fail(function(response) {
			if(response.status == 404) {	
				hideAlert(".alert-voto-sucesso");	
				console.log("###### CPF inv&aacute;lido!");
				showAlert(".alert-voto-falha", "CPF inv&aacute;lido!");	
			} else {
				console.log("###### Erro ao consultar CPF: " + response.responseText);
				alert(response.responseText, null, "Erro");
			}
		});
	}
	
	function validarCpfAntesVotar(cpf) {
		console.log("###### Validando CPF antes de votar.");		
		$.ajax({
		    url: '/dbc/votacoes/checarCPF/' + cpf,
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {				
			if(data != null) {
				if(data.status == "ABLE_TO_VOTE") {
					console.log("###### CPF validado e apto a votar.");
					return 1;
				} else {
					hideAlert(".alert-voto-sucesso");	
					console.log("###### CPF validado, mas inapto a votar.");
					showAlert(".alert-voto-falha", "Associado n&atilde;o est&aacute; habilitado para vota&ccedil;&atilde;o.");
				}
			} else {
				hideAlert(".alert-voto-sucesso");	
				showAlert(".alert-voto-falha", "Interface de valida&ccedil;&atilde;o de CPF com problemas.");
			}
		}).fail(function(response) {
			if(response.status == 404) {	
				hideAlert(".alert-voto-sucesso");	
				console.log("###### CPF inv&aacute;lido!");		
				showAlert(".alert-voto-falha", "CPF inv&aacute;lido!");
			} else {
				console.log("###### Erro ao consultar CPF: " + response.responseText);
				alert(response.responseText, null, "Erro");
			}
		});		
		
		return 0;
	}
	
	function showAlert(elemento, msg) {
		$(elemento + " label").html(msg);					
		$(elemento).fadeIn();
	}
	
	function hideAlert(elemento) {
		$(elemento + " label").html("");					
		$(elemento).fadeOut();
	}
	
	function votar(cpf, data) {
		
		var valid = validarCpfAntesVotar(cpf);
		
		if(valid == 1) {
			console.log("###### Registrando voto.");		
			$.ajax({
			    url: '/dbc/votacoes/',
				data: data,
			    type: 'POST',
			    async: false,
			    cache: false,
				contentType: 'application/json'
			}).done(function(data) {	
				hideAlert(".alert-voto-falha");
				console.log("###### Voto computado com sucesso!");		
				showAlert(".alert-voto-sucesso", "Voto computado com sucesso!");
			}).fail(function(response) {
				if(response.status == 409) {
					hideAlert(".alert-voto-sucesso");		
					console.log("###### " + response.responseText);			
					showAlert(".alert-voto-falha", response.responseText);	
				} else {
					console.log("###### Erro ao computar voto: " + response.responseText);			
					alert(response.responseText, null, "Erro");
				}
			});
		} 
	}
	
	function findAllAssociados(){
		console.log("###### Consultando todos os associados.");	
		$.ajax({
		    url: '/dbc/associados/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-associados tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td><td>" + value.cpf + "</td></tr>";															
	                $('#grid-associados tbody').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-associados").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function findAllPautas(){
		console.log("###### Consultando todos as pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-pautas tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td></tr>";															
	                $('#grid-pautas tbody').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-pautas").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function popularComboAssociados(){
		console.log("###### Populando combo de associados.");
		$.ajax({
		    url: '/dbc/associados/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		

				$('#cmb-voto-associado').find('option').remove();
				$('#cmb-voto-associado').append("<option value='0'>Selecione</option>");
				
				$.each(data, function(key, value){					
					$('#cmb-voto-associado').append($('<option>', {
                        value: value.id,
                        text: value.nome,
						cpf: value.cpf
                    }));
	            });
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function populateComboPautas() {
		console.log("###### Populando combo de pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#cmb-pauta').find('option').remove();
				$('#cmb-pauta').append("<option value='0'>Selecione</option>");
				
				$.each(data, function(key, value){					
					$('#cmb-pauta').append($('<option>', {
                        value: value.id,
                        text: value.nome
                    }));
	            });
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
=======
$( document ).ready(function() {
	$(".container").hide();
	$("#container-home").show();
	$('#li-home').addClass('active');
	$(".alert").hide();
	$(".alert label").html("");
	
    $("#li-home a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-home').addClass('active');

		$(".container").hide();
		$("#container-home").show();
		
		event.preventDefault();
	});
	
	$("#li-list-pautas a").click(function (event) {		
		$('.nav .active').removeClass('active');
  		$('#li-list-pautas').addClass('active');
		
		console.log("######Buscando no banco todas as pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-pautas tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td></tr>";
					$('#grid-pautas').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-pautas").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
		
		event.preventDefault();
	});
	
	$("#li-list-associados a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-list-associados').addClass('active');

		findAllAssociados();
		
		event.preventDefault();
	});
	
	$("#li-votacao a").click(function (event) {
		$('.nav .active').removeClass('active');
  		$('#li-votacao').addClass('active');
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		
		var cookie = $.cookie('timesession');
		if(cookie != null || cookie != undefined) {
			//Há uma sessão aberta!
			$(".container").hide();
			$("#container-sessao").show();
			$("#area-votacao").show();			
			$("#area-finalizar").hide();
			
			popularComboAssociados();
		
			var dateCookie = new Date(cookie.split(";")[0]);
			var nomePauta = cookie.split(";")[2];
			var idPauta = parseInt(cookie.split(";")[1]);

			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	
			
			//iniciando cronometro
			dispararCronometro(dateCookie);			
			
		} else {
			$(".container").hide();
			$("#container-votacao").show();
		}
		
		populateComboPautas();
		
		event.preventDefault();
	});
	
	$("#btn-abrir-sessao").click(function (event) {
		
		$(".container").hide();
		$("#container-sessao").show();		
		$("#area-finalizar").hide();
		$("#area-votacao").show();
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		
		popularComboAssociados();
		
		var dateCron = null;
				
		var cookie = $.cookie('timesession');
		if(cookie != null || cookie != undefined) {
			//Há uma sessão aberta!
			var dateCookie = new Date(cookie.split(";")[0]);
			var nomePauta = cookie.split(";")[2];
			var idPauta = parseInt(cookie.split(";")[1]);
			
			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	

			dateCron = dateCookie;
				
		} else {
			var sessao = parseInt($("#tempo-sessao").val());
			
			sessao = (sessao == null || sessao == 0 || isNaN(sessao)) ? 1 : sessao;
			
			var date = new Date();
			date.setMinutes(date.getMinutes() + sessao);
			
			var nomePauta = $("#cmb-pauta option:selected").text();
			var idPauta = $("#cmb-pauta option:selected").val();
			
			$("#id-pauta-sessao").val(idPauta);
			$("#lbl-pauta-sessao").text(nomePauta);	
		
			//remover cookie
			$.removeCookie('timesession', { path: '/' });
			
			//iniciando cookie para que o cronometro se mantenha mesmo que a página se feche
			$.cookie('timesession', date + ";" + idPauta + ";" + nomePauta, { expires: date, path: '/' });
						
			dateCron = date;
		}
		
		//iniciando cronometro
		dispararCronometro(dateCron);
		
		event.preventDefault();
	});
	
	function dispararCronometro(date) {
		$("#lbl-clock").show();
		$('div#clock').countdown(date)
			.on('update.countdown', function(event) {
				var $this = $(this);
				$this.html(event.strftime('<span>%H:%M:%S</span>'));
		  	}).on('finish.countdown', function(event) {
				finalizarVotacao($(this));
		  	});
	}
	
	function finalizarVotacao(elem) {
		hideAlert(".alert-voto-falha");
		hideAlert(".alert-voto-falha");
		$("#lbl-clock").hide();
		elem.html("<label id='encerrada'>A vota&ccedil;&atilde;o est&aacute; encerrada!</label>");
		
		elem.countdown('stop');
		$.removeCookie('timesession', { path: '/' });
		
		var idPauta = $("#id-pauta-sessao").val();
				
		$("#area-votacao").hide();
		$("#area-finalizar").show();
	}
	
	$("#btn-resultado").click(function () {
		hideAlert(".alert-voto-falha");	
		hideAlert(".alert-voto-sucesso");	
		
		var idPauta = $("#id-pauta-sessao").val();
		informarResultado(idPauta);
	});
	
	function informarResultado(idPauta) {
		console.log("###### Informando resultado!");
		$.ajax({
		    url: '/dbc/votacoes/informarResultado/' + idPauta,
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {	
				var sim = data.sim;
				var nao = data.nao;
				
				$("#lbl-voto-sim").html("Contagem de votos SIM: " + sim);
				$("#lbl-voto-nao").html("Contagem de votos SIM: " + nao);
				
				if(sim > nao) {
					console.log("###### O voto vencedor foi: SIM.");
					$("#lbl-resultado").html("O voto vencedor foi: SIM.");
				} else if (nao > sim) {
					console.log("###### O voto vencedor foi: N&Atilde;O.");
					$("#lbl-resultado").html("O voto vencedor foi: N&Atilde;O.");
				} else {
					console.log("###### A vota&ccedil;&atilde;o terminou em empate!");
					$("#lbl-resultado").html("A vota&ccedil;&atilde;o terminou em empate!");
				}							
						
				$("#resultado").fadeIn();				
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	$("#btn-encerrar").click(function (event) {
		finalizarVotacao($("div#clock"));
	});
	
	$("#btn-nova-sessao").click(function (event) {
		hideAlert(".alert-voto-sucesso");				
		$("#li-votacao a").click();
	});
	
	$("#btn-votar").click(function (event) {
		hideAlert(".alert-voto-sucesso");				
		
		var nomePauta = $("#cmb-pauta option:selected").text();
		var idPauta = $("#id-pauta-sessao").val();
		
		var nomeAssociado = $("#cmb-voto-associado option:selected").text();
		var idAssociado = $("#cmb-voto-associado option:selected").val();
		var cpfAssociado = $("#cmb-voto-associado option:selected").attr("cpf");
		
		var voto = $("input[name='radio-voto']:checked"). val();
		
		var data2 = {"pauta": "{id: " + idPauta + ", nome: " + nomePauta + "}",
			"associado": "{id: " + idAssociado + ", nome: " + nomeAssociado + ", cpf: " + cpfAssociado + "}", 
			"voto": voto
		};
		
		var data = JSON.stringify({
			pauta : {id: idPauta, nome: nomePauta}, 
			associado : {id : idAssociado, nome : nomeAssociado, cpf : cpfAssociado}, 
			voto: voto
		});		
		
		votar(cpfAssociado, data);
	});
	
	$("#btn-add-pauta").click(function (event) {
		$(".container").hide();
		$("#container-pauta").show();
		
		$("#campos-pauta input").val(null);
		
		event.preventDefault();
	});
	
	$("#btn-add-associado").click(function (event) {
		$(".container").hide();
		$("#container-associado").show();
		
		$("#campos-associado input").val(null);
		
		event.preventDefault();
	});
	
	$("#btn-salvar-associado").click(function (event) {
		
		hideAlert(".container-associado .alert-voto-falha");

		var cpf = $("#cpf").val();

		validarCpfAntesSalvarAssociado(cpf);
		
		event.preventDefault();
	});
	
	$("#btn-salvar-pauta").click(function (event) {
		
		console.log("###### Salvando pauta.");
		$.ajax({
		    url: '/dbc/pautas/',
			data: JSON.stringify({nome: $("#nome-pauta").val()}),
		    type: 'POST',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {
			findAllPautas();
			console.log("###### Pauta salva.");
		    $(".container").hide();
			$("#container-list-pautas").show();
			
			$(".alert-pauta").fadeIn();
			
		}).fail(function(response) {
			console.log("###### Erro ao salvar pauta: " + response.responseText);
		    alert(response.responseText, null, "Erro");
		});
		
		event.preventDefault();
	});
	
	function salvarAssociado() {
		console.log("###### Salvando associado.");
		$.ajax({
		    url: '/dbc/associados/',
			data: JSON.stringify({"nome": $("#nome-associado").val(), "cpf": $("#cpf").val()}),
		    type: 'POST',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {
			findAllAssociados();
			
			console.log("###### Associado salvo.");
			
		    $(".container").hide();
			$("#container-list-associados").show();
			
			$(".alert-associado").fadeIn();
			
		}).fail(function(response) {
			console.log("###### Erro ao salvar associado: " + response.responseText);
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function validarCpfAntesSalvarAssociado(cpf) {
		console.log("###### Validando CPF antes de salvar associado.");
		$.ajax({
		    url: 'https://user-info.herokuapp.com/users/' + cpf,
			crossDomain: true,
		    type: 'GET',
		    async: false,
		    cache: false,
			contentType: 'application/json'
		}).done(function(data) {	
			
			if(data != null) {
				console.log("###### CPF válido.");
				salvarAssociado();
			} else {
				hideAlert(".alert-voto-sucesso");	
				console.log("###### Interface de valida&ccedil;&atilde;o de CPF com problemas.");
				showAlert(".alert-voto-falha", "Interface de valida&ccedil;&atilde;o de CPF com problemas.");
			}

		}).fail(function(response) {
			if(response.status == 404) {	
				hideAlert(".alert-voto-sucesso");	
				console.log("###### CPF inv&aacute;lido!");
				showAlert(".alert-voto-falha", "CPF inv&aacute;lido!");	
			} else {
				console.log("###### Erro ao consultar CPF: " + response.responseText);
				alert(response.responseText, null, "Erro");
			}
		});
	}
	
	function validarCpfAntesVotar(cpf) {
		console.log("###### Validando CPF antes de votar.");		
		$.ajax({
		    url: '/dbc/votacoes/checarCPF/' + cpf,
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {				
			if(data != null) {
				if(data.status == "ABLE_TO_VOTE") {
					console.log("###### CPF validado e apto a votar.");
					return 1;
				} else {
					hideAlert(".alert-voto-sucesso");	
					console.log("###### CPF validado, mas inapto a votar.");
					showAlert(".alert-voto-falha", "Associado n&atilde;o est&aacute; habilitado para vota&ccedil;&atilde;o.");
				}
			} else {
				hideAlert(".alert-voto-sucesso");	
				showAlert(".alert-voto-falha", "Interface de valida&ccedil;&atilde;o de CPF com problemas.");
			}
		}).fail(function(response) {
			if(response.status == 404) {	
				hideAlert(".alert-voto-sucesso");	
				console.log("###### CPF inv&aacute;lido!");		
				showAlert(".alert-voto-falha", "CPF inv&aacute;lido!");
			} else {
				console.log("###### Erro ao consultar CPF: " + response.responseText);
				alert(response.responseText, null, "Erro");
			}
		});		
		
		return 0;
	}
	
	function showAlert(elemento, msg) {
		$(elemento + " label").html(msg);					
		$(elemento).fadeIn();
	}
	
	function hideAlert(elemento) {
		$(elemento + " label").html("");					
		$(elemento).fadeOut();
	}
	
	function votar(cpf, data) {
		
		var valid = validarCpfAntesVotar(cpf);
		
		if(valid == 1) {
			console.log("###### Registrando voto.");		
			$.ajax({
			    url: '/dbc/votacoes/',
				data: data,
			    type: 'POST',
			    async: false,
			    cache: false,
				contentType: 'application/json'
			}).done(function(data) {	
				hideAlert(".alert-voto-falha");
				console.log("###### Voto computado com sucesso!");		
				showAlert(".alert-voto-sucesso", "Voto computado com sucesso!");
			}).fail(function(response) {
				if(response.status == 409) {
					hideAlert(".alert-voto-sucesso");		
					console.log("###### " + response.responseText);			
					showAlert(".alert-voto-falha", response.responseText);	
				} else {
					console.log("###### Erro ao computar voto: " + response.responseText);			
					alert(response.responseText, null, "Erro");
				}
			});
		} 
	}
	
	function findAllAssociados(){
		console.log("###### Consultando todos os associados.");	
		$.ajax({
		    url: '/dbc/associados/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-associados tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td><td>" + value.cpf + "</td></tr>";															
	                $('#grid-associados tbody').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-associados").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function findAllPautas(){
		console.log("###### Consultando todos as pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#grid-pautas tbody > tr').remove();
				$.each(data, function(key, value){					
					var linha = "<tr><td>" + value.id + "</td><td>" + value.nome + "</td></tr>";															
	                $('#grid-pautas tbody').append(linha);
	            });
			}
			
		    $(".container").hide();
			$("#container-list-pautas").show();
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function popularComboAssociados(){
		console.log("###### Populando combo de associados.");
		$.ajax({
		    url: '/dbc/associados/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		

				$('#cmb-voto-associado').find('option').remove();
				$('#cmb-voto-associado').append("<option value='0'>Selecione</option>");
				
				$.each(data, function(key, value){					
					$('#cmb-voto-associado').append($('<option>', {
                        value: value.id,
                        text: value.nome,
						cpf: value.cpf
                    }));
	            });
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
	
	function populateComboPautas() {
		console.log("###### Populando combo de pautas.");
		$.ajax({
		    url: '/dbc/pautas/findAll',
		    type: 'GET',
		    async: false,
		    cache: false
		}).done(function(data) {
			if(data != null) {		
				$('#cmb-pauta').find('option').remove();
				$('#cmb-pauta').append("<option value='0'>Selecione</option>");
				
				$.each(data, function(key, value){					
					$('#cmb-pauta').append($('<option>', {
                        value: value.id,
                        text: value.nome
                    }));
	            });
			}
		}).fail(function(response) {
		    alert(response.responseText, null, "Erro");
		});
	}
>>>>>>> f10e9428b25df94175428da312ee99e950ea1567
});