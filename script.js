let pDiv = document.getElementById(`pDiv`)
let searchByName = document.getElementById(`searchByName`)
let searchByTag = document.getElementById(`searchByTag`)

let studentsDataArray
let gradeTotal

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

  studentsDataArray = JSON.parse(this.response).students

  for (let i = 0; i < studentsDataArray.length; i++) {
    studentsDataArray[i].tags = []
    render(i)
  }
}

function searchForName() {
  pDiv.innerHTML = ``

  for (let i = 0; i < studentsDataArray.length; i++) {

    let student = studentsDataArray[i]
    let firstNameCheck = true
    let lastNameCheck = true
    
    for (let j = 0; j < searchByName.value.length; j++) {
      
      if (searchByName.value.length <= student.firstName.length) {
        if (searchByName.value[j] != student.firstName[j].toLowerCase()) {
          firstNameCheck = false
        }
      }
      else {
        firstNameCheck = false
      }
  
      if (searchByName.value.length <= student.lastName.length) {
        if (searchByName.value[j] != student.lastName[j].toLowerCase()) {
          lastNameCheck = false
        }
      }
      else {
        lastNameCheck = false
      }
    }
  //CANNOT RENDER UNTIL I KNOW WHETHER SEARCHBYTAG.VALUE IS EMPTY. IF IT'S NOT EMPTY, 
  //I ALSO NEED TO CHECK TO SEE IF THE STUDENT HAS A TAG EQUAL TO SEARCGBYTAG.VALUE.
    if (firstNameCheck == true) {
      render(i)
    }
    else if (lastNameCheck == true) {
      render(i)
    } 
  }
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

function render(i) {
     
  gradeTotal = 0

  let div = document.createElement(`div`)
  div.id = i
  pDiv.appendChild(div)
  
  let img = document.createElement(`img`)
  img.classList.add(`image`)
  div.appendChild(img)

  img.src = studentsDataArray[i].pic

  let nameParagraph = document.createElement(`p`)
  div.appendChild(nameParagraph)
  nameParagraph.classList.add(`nameParagraph`)
  nameParagraph.innerHTML = `${studentsDataArray[i].firstName} ${studentsDataArray[i].lastName}`

  let showScoresButton = document.createElement(`button`)
  div.appendChild(showScoresButton)
  showScoresButton.addEventListener(`click`, showScores)
  showScoresButton.innerHTML = `+`

  let emailParagraph = document.createElement(`p`)
  div.appendChild(emailParagraph)
  emailParagraph.innerHTML = `Email: ${studentsDataArray[i].email}`

  let coParagraph = document.createElement(`p`)
  div.appendChild(coParagraph)
  coParagraph.innerHTML = `Company: ${studentsDataArray[i].company}`

  let skillParagraph = document.createElement(`p`)
  div.appendChild(skillParagraph)
  skillParagraph.innerHTML = `Skill: ${studentsDataArray[i].skill}`

  let averageGradeParagraph = document.createElement(`p`)
  div.appendChild(averageGradeParagraph)

  for (let j = 0; j < studentsDataArray[i].grades.length; j++) {
    gradeTotal = gradeTotal + Number(studentsDataArray[i].grades[j])
  }
  averageGradeParagraph.innerHTML = `Average: ${(gradeTotal / studentsDataArray[i].grades.length)}%`

  let gradesDiv = document.createElement(`div`)
  div.appendChild(gradesDiv)
  gradesDiv.id = `gradesDiv` + div.id

  let tagsDiv = document.createElement(`div`)
  div.appendChild(tagsDiv)

  if (studentsDataArray[i].tags.length != 0) {
    for (let k = 0; k < studentsDataArray[i].tags.length; k++) {
      
      let tag = document.createElement('button')
      tagsDiv.appendChild(tag)
      tag.innerHTML = studentsDataArray[i].tags[k]
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

}