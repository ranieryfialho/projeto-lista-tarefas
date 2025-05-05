// Seleção de elementos do DOM
const overlay = document.querySelector("#overlay");
const criarTarefa = document.querySelector("#criarTarefa");
const lista = document.querySelector("#lista");
const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const busca = document.querySelector("#busca");

// Funções para manipulação do modal
function abrirModal() {
  overlay.classList.add("active");
  criarTarefa.classList.add("active");
}

function fecharModal() {
  overlay.classList.remove("active");
  criarTarefa.classList.remove("active");
  resetarFormulario();
}

// Função para buscar tarefas do localStorage
function buscarTarefas() {
  try {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    inserirTarefas(tarefas);
  } catch (erro) {
    console.error("Erro ao buscar tarefas:", erro);
    lista.innerHTML = '<li style="width:100%; text-align:center; color:red;">Erro ao carregar tarefas!</li>';
  }
}

// Inicializar a aplicação buscando as tarefas
buscarTarefas();

// Função para inserir tarefas na lista
function inserirTarefas(listaDeTarefas) {
  if (listaDeTarefas.length > 0) {
    lista.innerHTML = "";
    listaDeTarefas.forEach(tarefa => {
      const concluida = tarefa.concluida ? "concluida" : "";
      lista.innerHTML += `
        <li class="${concluida}">
          <h5 class="${concluida}">
            ${tarefa.titulo}
            <div>
              <box-icon id="check" name='check-circle' type='solid' onclick="marcarComoConcluida(${tarefa.id}, ${!tarefa.concluida})" style="fill: ${tarefa.concluida ? "#4CAF50" : "#999"}"></box-icon>
              <box-icon id="edit" name='edit' type='solid' onclick="editarTarefa(${tarefa.id})"></box-icon>
              <box-icon id="delete" name='trash' size="sm" onclick="deletarTarefa(${tarefa.id})"></box-icon>
            </div>
          </h5>
          <p class="${concluida}">${tarefa.descricao}</p>
        </li>
      `;
    });
  } else {
    lista.innerHTML = '<li style="width:100%; text-align:center; color:#999;">Nenhuma tarefa registrada</li>';
  }
}

// Função para criar nova tarefa
function novaTarefa() {
  event.preventDefault();
  try {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const novaTarefa = {
      id: Date.now(), // Usar timestamp como ID único
      titulo: titulo.value,
      descricao: descricao.value,
      concluida: false
    };
    
    tarefas.push(novaTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    
    alert("Tarefa criada com sucesso!");
    fecharModal();
    buscarTarefas();
  } catch (erro) {
    console.error("Erro ao criar tarefa:", erro);
    alert("Erro ao criar tarefa!");
  }
}

// Função para deletar tarefa
function deletarTarefa(id) {
  if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
    try {
      let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
      tarefas = tarefas.filter(tarefa => tarefa.id !== id);
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
      
      alert("Tarefa deletada com sucesso!");
      buscarTarefas();
    } catch (erro) {
      console.error("Erro ao deletar tarefa:", erro);
      alert("Erro ao deletar tarefa!");
    }
  }
}

// Função para editar tarefa
function editarTarefa(id) {
  try {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefa = tarefas.find(t => t.id === id);
    
    if (tarefa) {
      document.querySelector("#titulo").value = tarefa.titulo;
      document.querySelector("#descricao").value = tarefa.descricao;
      
      const form = document.querySelector("#form-tarefa");
      const botao = form.querySelector("button");
      botao.textContent = "Atualizar";
      
      form.setAttribute("data-id", id);
      form.setAttribute("data-editing", "true");
      
      abrirModal();
    }
  } catch (erro) {
    console.error("Erro ao buscar tarefa:", erro);
    alert("Erro ao buscar dados da tarefa!");
  }
}

// Função para resetar o formulário
function resetarFormulario() {
  const form = document.querySelector("#form-tarefa");
  form.reset();
  
  // Restaurar o botão para "Criar"
  const botao = form.querySelector("button");
  botao.textContent = "Criar";
  
  // Limpar os atributos de dados
  form.removeAttribute("data-id");
  form.removeAttribute("data-editing");
}

// Manipulador de envio do formulário
document.querySelector("#form-tarefa").onsubmit = function(event) {
  event.preventDefault();
  
  const form = document.querySelector("#form-tarefa");
  const isEditing = form.getAttribute("data-editing") === "true";
  
  if (isEditing) {
    const id = parseInt(form.getAttribute("data-id"));
    atualizarTarefa(id);
  } else {
    novaTarefa();
  }
};

// Função para atualizar tarefa
function atualizarTarefa(id) {
  try {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
      tarefas[index].titulo = titulo.value;
      tarefas[index].descricao = descricao.value;
      
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
      
      alert("Tarefa atualizada com sucesso!");
      fecharModal();
      buscarTarefas();
    }
  } catch (erro) {
    console.error("Erro ao atualizar tarefa:", erro);
    alert("Erro ao atualizar tarefa!");
  }
}

// Função para marcar tarefa como concluída
function marcarComoConcluida(id, status) {
  try {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
      tarefas[index].concluida = status;
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
      buscarTarefas();
    }
  } catch (erro) {
    console.error("Erro ao atualizar status da tarefa:", erro);
    alert("Erro ao marcar tarefa como concluída!");
  }
}

// Função para pesquisar tarefas
function pesquisarTarefas() {
  const lis = document.querySelectorAll("ul li");
  const termo = busca.value.toLowerCase().trim();

  lis.forEach(li => {
    const titulo = li.querySelector("h5").innerText.toLowerCase();
    const descricao = li.querySelector("p").innerText.toLowerCase();

    if (termo.length > 0) {
      if (titulo.includes(termo) || descricao.includes(termo)) {
        li.classList.remove("oculto");
      } else {
        li.classList.add("oculto");
      }
    } else {
      li.classList.remove("oculto");
    }
  });
}

// Adicionar evento de pesquisa ao campo de busca
busca.addEventListener("keyup", pesquisarTarefas);