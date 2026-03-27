/*
Debido a que antes no funcionaba cuando tenia todo junto, creo que vamos a empezar a separar ciertas llamadas a la api para que funcione mejor.
*/

const feedbackForm = document.getElementById("feedbackForm");


if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            usuario: document.getElementById("feedbackUsuario").value.trim() || null,
            mensaje: document.getElementById("feedbackMensaje").value.trim(),
            version: VERSION
        };

        const { error } = await supabaseClient
            .from("feedback")
            .insert(payload);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("feedbackModal")
        );

        if (error) {
            console.error("Error enviando feedback:", error.message);
            alert("Error al enviar el feedback. Inténtalo de nuevo.");
        } else {
            modal.hide();
            document.getElementById("feedbackUsuario").value = "";
            document.getElementById("feedbackMensaje").value = "";
        }
    });
}