import React, { useEffect, useState } from "react";

import { AiFillLike } from 'react-icons/ai'

import api from './services/api'

import "./styles.css";

function App() {
  const [newRepository, setNewRepository] = useState({
    title: '',
    url: '',
    techs: ''
  })
  const [repositories, setRepository] = useState([])

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepository(response.data)
    });
  }, []);

  function handleTitleChange(e) {
    setNewRepository({
      title: e.target.value,
      url: newRepository.url,
      techs: newRepository.techs
    })
  }

  function handleUrlChange(e) {
    setNewRepository({
      title: newRepository.title,
      url: e.target.value,
      techs: newRepository.tech
    })
  }
  function handleTechsChange(e) {
    setNewRepository({
      title: newRepository.title,
      url: newRepository.url,
      techs: e.target.value
    })
  }

  async function handleAddRepository(e) {
    e.preventDefault()
    const response = await api.post('/repositories', {
      title: newRepository.title,
      url: newRepository.url,
      techs: newRepository.techs ? newRepository.techs.replace(' ', '').split(',') : ' '
    })

    setRepository([...repositories, response.data])
    setNewRepository({
      title: '',
      url: '',
      techs: ''
    })
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    setRepository(repositories.filter(repository => repository.id !== id));
  }

  return (
    <>
      <header>
        <img alt="Projects Repository" src="https://ik.imagekit.io/dkdai9mqcy/logo_Projects_Repository_branco_zvoVRE_Nc.png" />
        <form>
          <div>
            <input type="text" placeholder="Titulo do projeto" value={newRepository.title} onChange={handleTitleChange} />
            <input type="text" placeholder="Url do repositorio GitHub" value={newRepository.url} onChange={handleUrlChange} />
          </div>
          <input type="text" id="tech" placeholder="Tecnologias empregadas (separar por virgula)" value={newRepository.techs} onChange={handleTechsChange} />
          <button id="add" onClick={e => handleAddRepository(e)}>Adicionar</button>
        </form>
      </header>
      <div>
        <ul data-testid="repository-list">
          {repositories.map(repository => (
            <li key={repository.id}>
              <div>
                <h1><a href={repository.url}>{repository.title}</a></h1>
                <span>Techs: {JSON.stringify(repository.techs).replace(",", ", ").replace(/.*\[|\]|"/g, '')}</span>
                <span id="like">
                  <AiFillLike color="#ec1868" size={24} />
                  <p> {`${repository.likes}`}</p>
                </span>
              </div>
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
            </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
