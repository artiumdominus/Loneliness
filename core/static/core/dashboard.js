//
let csrftoken = null;


// Faz os seletores de cor se comportarem como radio-buttons
// Made the color selectors behave like radio-buttons
let selected_color = null;
$('#colors .icons').click( function() {
	$('#colors .icons.selected').removeClass('selected')
	$(this).addClass('selected')
	selected_color = this.id;
});

function selectColor() {
	document.getElementById('pictures').style.display = "none";
	document.getElementById('colors').style.display = "block";
}

function selectPicture() {
	document.getElementById('colors').style.display = "none";
	document.getElementById('pictures').style.display = "block";
}

// Ativa os dropdowns
// Activate the dropdowns
$('.ui.dropdown')
	.dropdown()
;

// Ativa os checkboxes
// Activate the checkboxes
$('.ui.radio.checkbox')
	.checkbox()
;

// Open Settings Modal
function settings() {
	$( '#settings' ).modal( 'show' );
}

// Open New Page Modal
function newPage() {
	$( '#new-page' ).modal( 'show' );
}

// Close Side Bar
function closeBar() {
	$( '.ui.sidebar' ).sidebar( 'toggle' );
}

// Model
var user = {};
var pages = {};
var page = null;
var frames = {};

function load() {
	csrftoken = $("[name=csrfmiddlewaretoken]").val();
	
	var requestuser = new XMLHttpRequest();
	requestuser.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			user = JSON.parse(this.responseText);
			document.getElementById("username").innerHTML = user.username;
		}
	}
	requestuser.open("GET", "/api/auth/user/", true);
	requestuser.send();
	
	var requestpage = new XMLHttpRequest();
	requestpage.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let pages_gotten = JSON.parse(this.responseText);
			if (pages_gotten.length > 0) {
				setPages(pages_gotten);
				goTo(pages_gotten[0].id);
			}
		}
	}
	requestpage.open("GET", "/api/pages/", true);
	requestpage.send();
}

function setPages(pages_gotten) {
	pages = {};
	
	for (let i = 0; i < pages_gotten.length; ++i) {
		pages[pages_gotten[i].id] = pages_gotten[i];
	}
	
	let pages_menu = document.getElementById("pages");
	pages_menu.innerHTML = '';
	
	for (let id in pages) {
		let link = document.createElement("a");
		link.classList.add("item");
		link.addEventListener("click", function() { goTo(id) });
		link.id = "pagelink" + id;
		
		let text = document.createTextNode("› " + pages[id].title);
		link.appendChild(text);
		
		pages_menu.appendChild(link);
	}
}

function goTo(page_id) {
	if (page != null) {
		document.getElementById("pagelink" + page.id).innerHTML = "› " + page.title;
	}
	page = pages[page_id];
	document.getElementById("pagelink" + page.id).innerHTML = "›› <u>" + page.title + "</u>";
	
	document.title = user.username + " › " + page.title + " :: Loneliness";
	document.getElementById("name").value = page.title;
	document.getElementById("description").value = page.description;
	document.getElementById(page.backgroundColor).click();
	
	let requestframes = new XMLHttpRequest();
	requestframes.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let frames_gotten = JSON.parse(this.responseText);
			document.getElementById("root").style.backgroundColor = page.backgroundColor;
			setFrames(frames_gotten);
		}
	}
	requestframes.open("GET", "/api/pages/" + page.id + "/components/");
	requestframes.send();
}

function setFrames(frames_gotten) {
	frames = {};
	
	for (let i = 0; i < frames_gotten.length; ++i) {
		frames[frames_gotten[i].id] = frames_gotten[i];
	}
	
	let root = document.getElementById("root");
	root.innerHTML = '';
	
	for (let id in frames) {
		
		let frame = document.createElement("div");
		frame.classList.add("frame");
		frame.classList.add("normal");
		frame.id = "frame" + id;
		frame.style.top = frames[id].y + "px";
		frame.style.left = frames[id].x + "px";
		//frame.addEventListener("dblclick", function() { edit(id) })
		
		let content = document.createElement("div");
		content.classList.add("ui");
		content.classList.add("segment");
		content.id = "content" + id;
		
		//let text = document.createTextNode(frames[id].description);
		//content.appendChild(text);
		content.innerHTML = frames[id].description;
		
		frame.appendChild(content);
		
		let menu = document.createElement("div");
		menu.classList.add("ui");
		menu.classList.add("vertical");
		menu.classList.add("tiny");
		menu.classList.add("icon");
		menu.classList.add("buttons");
		
		let editButton = document.createElement("button");
		editButton.classList.add("ui");
		editButton.classList.add("button");
		editButton.addEventListener("click", function() { edit(id) });
		
		let icon = document.createElement("i");
		icon.classList.add("edit");
		icon.classList.add("icon");
		
		editButton.appendChild(icon);
		menu.appendChild(editButton);
		
		//let moveButton = document.createElement("button");
		//moveButton.classList.add("ui");
		//moveButton.classList.add("button");
		
		//icon = document.createElement("i");
		//icon.classList.add("arrow");
		//icon.classList.add("right");
		//icon.classList.add("icon");
		
		//moveButton.appendChild(icon);
		//menu.appendChild(moveButton);
		
		let cloneButton = document.createElement("button");
		cloneButton.classList.add("ui");
		cloneButton.classList.add("button");
		cloneButton.addEventListener("click", function() { clone(id) });
		
		icon = document.createElement("i");
		icon.classList.add("clone");
		icon.classList.add("outline");
		icon.classList.add("icon");
		
		cloneButton.appendChild(icon);
		menu.appendChild(cloneButton);
		
		//let archiveButton = document.createElement("button");
		//archiveButton.classList.add("ui");
		//archiveButton.classList.add("button");
		
		//icon = document.createElement("i");
		//icon.classList.add("archive");
		//icon.classList.add("icon");
		
		//archiveButton.appendChild(icon);
		//menu.appendChild(archiveButton);
		
		let deleteButton = document.createElement("button");
		deleteButton.classList.add("ui");
		deleteButton.classList.add("button");
		deleteButton.addEventListener("click", function() { deleteFrame(id) });
		
		icon = document.createElement("i");
		icon.classList.add("x");
		icon.classList.add("icon");
		
		deleteButton.appendChild(icon);
		menu.appendChild(deleteButton);
		
		//let configureButton = document.createElement("button");
		//configureButton.classList.add("ui");
		//configureButton.classList.add("button");
		
		//icon = document.createElement("i");
		//icon.classList.add("cog");
		//icon.classList.add("icon");
		
		//configureButton.appendChild(icon);
		//menu.appendChild(configureButton);
		
		//let tagButton = document.createElement("button");
		//tagButton.classList.add("ui");
		//tagButton.classList.add("button");
		
		//icon = document.createElement("i");
		//icon.classList.add("tag");
		//icon.classList.add("icon");
		
		//tagButton.appendChild(icon);
		//menu.appendChild(tagButton);
		
		frame.appendChild(menu);
		
		let saveButton = document.createElement("button");
		saveButton.classList.add("ui");
		saveButton.classList.add("tiny");
		saveButton.classList.add("icon");
		saveButton.classList.add("button");
		saveButton.addEventListener("click", function() { save(id) });
		
		icon = document.createElement("i");
		icon.classList.add("save");
		icon.classList.add("icon");
		
		saveButton.appendChild(icon);
		frame.appendChild(saveButton);
		
		root.appendChild(frame);
		
		$( function() { 
			$( '#frame' + id ).draggable({
				stop: function() {
					updateFramePosition(id);
				}
			})
		});
	}
	
	//$( function() {
	//	$( '.frame' ).draggable();
	//} );
}

function createPage() {
	let title = document.getElementById("page name input").value;
	let newpage = {
		title: title,
		url: "https://www.wikipedia.org",
		description: "No description.",
		visibility: "PUBLIC",
		backgroundColor: "white"
	}
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 201) {
			reloadPages();
		}
	}
	request.open("POST", "/api/pages/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json")
	request.send(JSON.stringify(newpage));
}

function reloadPages() {
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let pages_gotten = JSON.parse(this.responseText);
			setPages(pages_gotten);
			goTo(page.id);
		}
	}
	request.open("GET", "/api/pages/", true);
	request.send();
}

function updatePage() {
	let title = document.getElementById("name").value;
	let description = document.getElementById("description").value;
	
	let updatedpage = {
		title: title,
		url: "https://www.wikipedia.org",
		description: description,
		visibility: "PUBLIC",
		backgroundColor: selected_color
	}
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			reloadPages(); // <- Alterar manualmente
		}
	}
	request.open("PUT", "/api/pages/" + page.id + "/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(updatedpage));
	
}

function deletePage() {
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 204) {
			
			var requestpage = new XMLHttpRequest();
			requestpage.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					let pages_gotten = JSON.parse(this.responseText);
					if (pages_gotten.length > 0) {
						setPages(pages_gotten);
						goTo(pages_gotten[0].id);
					}
				}
			}
			requestpage.open("GET", "/api/pages/", true);
			requestpage.send();
			
		}
	}
	request.open("DELETE", "/api/pages/" + page.id + "/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.send();
	
	$( '#settings' ).modal( 'hide' );
}

function cancelPageSettings() {
	setTimeout( function() {
		document.getElementById("name").value = page.title;
		document.getElementById("description").value = page.description;
		document.getElementById(page.backgroundColor).click();
	}, 100);
}

function createFrame() {
	let newframe = {
		name: "A frame",
		description: "What are you thinking, " + user.username + "?",
		x: 500,
		y: 350
	}
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		reloadFrames();
	}
	request.open("POST", "/api/pages/" + page.id + "/components/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(newframe));
}

function reloadFrames() {
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let frames_gotten = JSON.parse(this.responseText);
			setFrames(frames_gotten);
		}
	}
	request.open("GET", "/api/pages/" + page.id + "/components/", true);
	request.send();
}

function updateFramePosition(frame) {
	let frame_element = document.getElementById("frame" + frame);
	frames[frame].x = parseInt(frame_element.style.left);
	frames[frame].y = parseInt(frame_element.style.top);
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) { // && this.status == 200
			console.log(this.responseText);
		}
	}
	request.open("PUT", "/api/pages/" + page.id + "/components/" + frame + "/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(frames[frame]));
}

function deleteFrame(frame) {
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 204) {
			reloadFrames();
		}
	}
	request.open("DELETE", "/api/pages/" + page.id + "/components/" + frame + "/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.send();
}

let editor = {};

function edit(frame) {
	$( "#frame" + frame ).draggable({disabled: true});
	
	BalloonEditor
		.create( document.querySelector( "#content" + frame ))
		.then( newEditor => {
			editor[frame] = newEditor;
		} )
		.catch( error => {
			console.error( error );
		} );
	
	document.getElementById("frame" + frame).classList.replace("normal", "editing");
}

function save(frame) {
	frames[frame].description = editor[frame].getData();
	
	editor[frame].destroy()
		.catch( error => {
			console.log( error );
		} );
	
	$( "#frame" + frame ).draggable({disabled: false});
	
	document.getElementById("frame" + frame).classList.replace("editing", "normal");
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) { // && this.status == 200
			console.log(this.responseText);
		}
	}
	request.open("PUT", "/api/pages/" + page.id + "/components/" + frame + "/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(frames[frame]));
}

function clone(frame) {
	let frame_clone = frames[frame];
	frame_clone.x = parseInt(frame_clone.x) + 20;
	frame_clone.y = parseInt(frame_clone.y) + 20;
	
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			console.log(this.responseText);
			reloadFrames();
		}
	}
	request.open("POST", "/api/pages/" + page.id + "/components/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(frame_clone));
}

function logout() {
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			window.location.href = '/login/';
		}
	}
	request.open("GET", "/api/auth/logout/", true);
	request.setRequestHeader("X-CSRFToken", csrftoken);
	request.send();
}
