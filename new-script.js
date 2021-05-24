let pDiv = document.getElementById(`pDiv`)
let searchByName = document.getElementById(`searchByName`)
let searchByTag = document.getElementById(`searchByTag`)

let studentsDataArray;
let gradeTotal;
let searchString;

searchByName.addEventListener(`input`, searchForName)
searchByTag.addEventListener(`keypress`, (event) => 
{
  if (event.keyCode == 13) {
    searchForTag()
  }
})

let request = new XMLHttpRequest()
request.addEventListener(`load`, handleGetData)
request.open(`GET`, `https://api.hatchways.io/assessment/students`)
request.send()

function handleGetData() {

  studentsDataArray = JSON.parse(this.response).students.map(student => {
    student.tags = []
  });

  render();
}

function searchForName() {
  pDiv.innerHTML = ``
  searchString = searchByName.value;
  if(seachString) render();
}

function showScores() {
  
  let gradesDiv = document.getElementById(`gradesDiv` + this.parentNode.id)
  
  if (gradesDiv.innerHTML == ``) {
    let gradesArray = studentsDataArray[this.parentNode.id].grades

    for (let i = 0; i < gradesArray.length; i ++) {
      let gradeParagraph = document.createElement(`p`)
      gradesDiv.appendChild(gradeParagraph)
      gradeParagraph.innerHTML = `Test ${i + 1}: ${gradesArray[i]}%`
    }
    this.innerHTML = `-`
  }
  else {
    gradesDiv.innerHTML = ``
    this.innerHTML = `+`
  }
}

function addNewTag(student, tagName) {
  pDiv.innerHTML = ``

  studentsDataArray[student].tags.push(tagName)

  for (let i = 0; i < studentsDataArray.length; i++) {  
    render(i)
  }
}

function searchForTag() {
  pDiv.innerHTML = ``

  for (let i = 0; i < studentsDataArray.length; i++) {
    let student = studentsDataArray[i]
    
    for (let j = 0; j < student.tags.length; j++) {
      
      if (student.tags[j] == searchByTag.value) {          
        render(i)
      }
    }
  }
}

function render() {

  studentsDataArray
  .filter((student) => {
    if(searchString && !(student.firstName.includes(searchString) || student.lastName.includes(searchString))) {
      return false;
    }

    if(tagSearch && !student.tags.includes(tagSearch)) {
      return false;
    }

    return true;
  })
  .forEach((student) => {
    gradeTotal = 0

    let div = document.createElement(`div`)
    div.id = i
    pDiv.appendChild(div)
    
    let img = document.createElement(`img`)
    img.classList.add(`image`)
    div.appendChild(img)

    img.src = student.pic

    let nameParagraph = document.createElement(`p`)
    div.appendChild(nameParagraph)
    nameParagraph.classList.add(`nameParagraph`)
    nameParagraph.innerHTML = `${student.firstName} ${student.lastName}`

    let showScoresButton = document.createElement(`button`)
    div.appendChild(showScoresButton)
    showScoresButton.addEventListener(`click`, showScores)
    showScoresButton.innerHTML = `+`

    let emailParagraph = document.createElement(`p`)
    div.appendChild(emailParagraph)
    emailParagraph.innerHTML = `Email: ${student.email}`

    let coParagraph = document.createElement(`p`)
    div.appendChild(coParagraph)
    coParagraph.innerHTML = `Company: ${student.company}`

    let skillParagraph = document.createElement(`p`)
    div.appendChild(skillParagraph)
    skillParagraph.innerHTML = `Skill: ${student.skill}`

    let averageGradeParagraph = document.createElement(`p`)
    div.appendChild(averageGradeParagraph)

    for (let j = 0; j < student.grades.length; j++) {
      gradeTotal = gradeTotal + Number(student.grades[j])
    }
    averageGradeParagraph.innerHTML = `Average: ${(gradeTotal / student.grades.length)}%`

    let gradesDiv = document.createElement(`div`)
    div.appendChild(gradesDiv)
    gradesDiv.id = `gradesDiv` + div.id

    let tagsDiv = document.createElement(`div`)
    div.appendChild(tagsDiv)

    if (student.tags.length != 0) {
      for (let k = 0; k < student.tags.length; k++) {
        
        let tag = document.createElement('button')
        tagsDiv.appendChild(tag)
        tag.innerHTML = student.tags[k]
      }
    }

    let newTag = document.createElement(`input`)
    div.appendChild(newTag)
    newTag.id = `newTag` + div.id
    newTag.addEventListener(`keypress`, (event) => { 
      
      if (event.keyCode == 13) {

        addNewTag(gradesDiv.parentNode.id, event.target.value) 
      }
    })
    newTag.placeholder = `Add a tag`

  });
}