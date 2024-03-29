package dbc.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pautas")
@JsonIgnoreProperties({"votacoes"})
public class Pautas {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name="nome", nullable=false)
	private String nome;
	
	@Column(name="sessao")
	private Integer sessao;
	
	@OneToMany(mappedBy = "pauta", targetEntity = Votacoes.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonIgnoreProperties
	private List<Votacoes> votacoes;

	public Pautas() {}
	
	public Pautas(String nome) {
		this.nome = nome;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public List<Votacoes> getVotacoes() {
		return votacoes;
	}

	public void setVotacoes(List<Votacoes> votacoes) {
		this.votacoes = votacoes;
	}

	public Integer getSessao() {
		return sessao;
	}

	public void setSessao(Integer sessao) {
		this.sessao = sessao;
	}
	
}