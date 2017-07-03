$(document).ready(function(){
	$("#tabs").tabs();
	$("select").change(function(event){
		console.log($("select option:selected").val());
		if($("select option:selected").val()== 7){
			$("#dispo-7").css("display","table");
			$("#dispo-14").css("display","none");
		} else{
			$("#dispo-7").css("display","none");
			$("#dispo-14").css("display","table");
		}
		event.preventDefault();
	});

	// Pour afficher la disponibilité qui doit être visible à l'ouverture de la page.
	$("select").change();

	var galleries = $('.ad-gallery').adGallery({
		// Width of the image, set to false and it will 
		// read the CSS width
		width: 600, 
		// Height of the image, set to false and it 
		// will read the CSS height
		height: 400, 
		// Opacity that the thumbs fades to/from, (1 removes fade effect)
		// Note that this effect combined with other effects might be 
		// resource intensive and make animations lag
		thumb_opacity: 0.7,
	});

	$("td a.continuer").click(function() {
		alert('Vous souhaitez reserver ce sejour. Notez ses références.');
	});
});
