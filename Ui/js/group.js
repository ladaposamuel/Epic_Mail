const submitButton = document.querySelector('.submit-btn');
const modal = document.getElementById('id-modal');
const modalContent = document.querySelector('.modal-content');
const closeModalButton = document.querySelector('.close-button');
const listGroups = document.querySelector('.list-groups');

// add member
const newMemberEmail = document.getElementById('add-member-input');
const addNewMemberButton = document.querySelector('.submit-button');
// header for sending requests
const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/groups';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

// modal for displaying feedback
const toggleModal = () => {
  modal.classList.toggle('show-modal');
};

// get members of a group
const getGroupMemebers = (e) => {
  const groupid = e.target.dataset.id;
  localStorage.setItem('groupid', groupid);
  // toggleModal('This will be the lists of members', 'success');
  fetch(`${url}/${groupid}/members`, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      // remove previous list
      if (document.getElementById('ul-members')) {
        document.getElementById('ul-members').remove();
      }
      const ul = document.createElement('ul');
      ul.setAttribute('id', 'ul-members');
      res.data.forEach((member) => {
        const li = document.createElement('li');
        // li.dataset.id = member.id;
        li.setAttribute('class', 'members-list');
        li.textContent = member.firstname;
        ul.appendChild(li);
        // add event listener to remove group on click
        li.addEventListener('click', removeMember);
      });
      modalContent.appendChild(ul);
      toggleModal();
    })
    .catch((error) => console.log(error));
};
// create a group
const createGroup = (e) => {
  const groupName = document.getElementById('groupname').value;
  const data = JSON.stringify({
    name: groupName.toLowerCase(),
  });
  e.preventDefault();
  if (groupName.length < 2) {
    // toggleModal('group name should be at least 2 characters long', 'failed');
    console.log('group name should be at least 2 characters long');
    return;
  }
  fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status == 'failed') {
        // toggleModal(`Error! ${res.error}`, 'failed');
        console.log('failed');
      }
      if (res.status === 'success') {
        document.getElementById('groupname').value = '';
        window.location.reload();
      }
    })
    .catch((error) => console.log(error));
};

// add member to a group
const addMember = (e) => {
  e.preventDefault();
  const groupid = localStorage.getItem('groupid');
  console.log(groupid);
  console.log(newMemberEmail.value);
  fetch(`${url}/${groupid}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: newMemberEmail.value,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      if (res.status == 'success') {
        window.location.reload();
      }
    })
    .catch((error) => console.log(error));
};

// fetch groups
fetch(url, {
  method: 'GET',
  headers,
})
  .then((response) => response.json())
  .then((res) => {
    if (res.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'no-groups');
      h2.textContent = 'No Groups';
      listGroups.appendChild(h2);
    }
    if (res.data.constructor === Array) {
      const ul = document.createElement('ul');
      res.data.forEach((group) => {
        const li = document.createElement('li');
        li.textContent = `@${group.name}`;
        li.dataset.id = group.id;
        li.addEventListener('click', getGroupMemebers);
        ul.appendChild(li);
      });
      listGroups.appendChild(ul);
    }
  })
  .catch((error) => console.log(error));

submitButton.addEventListener('click', createGroup);
addNewMemberButton.addEventListener('click', addMember);
closeModalButton.addEventListener('click', toggleModal);
