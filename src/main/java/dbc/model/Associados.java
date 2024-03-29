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
@Table(name = "associados")
@JsonIgnoreProperties({"votacoes"})
public class Associados {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name="nome", length = 40, nullable=false)
	private String nome;
	
	@Column(name="cpf", length = 11, nullable=false)
	private String cpf;
	
	@OneToMany(mappedBy = "associado", targetEntity = Votacoes.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Votacoes> votacoes;
	
	public Associados() {}
	
	public Associados(String nome, String cpf) {
		this.nome = nome;
		this.cpf = cpf;
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

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public List<Votacoes> getVotacoes() {
		return votacoes;
	}

	public void setVotacoes(List<Votacoes> votacoes) {
		this.votacoes = votacoes;
	}	
	
}