/* ============================================================
   Movie Watchlist — Scripts
   ============================================================ */

/**
 * Toggle the collapsed state of a card section.
 * @param {string} id - The element ID of the card to toggle.
 */
function toggleCard(id) {
    document.getElementById(id).classList.toggle('collapsed');
}

/**
 * Auto-dismiss flash messages after 4 seconds.
 */
(function initFlash() {
    const flash = document.getElementById('flashMsg');
    if (!flash) return;

    setTimeout(() => {
        flash.style.opacity = '0';
        flash.style.transform = 'translateY(-6px)';
        setTimeout(() => flash.remove(), 200);
    }, 4000);
})();

/**
 * Open the Edit Movie dialog and populate it with existing values.
 * @param {number} id       - Movie ID
 * @param {string} title    - Movie title
 * @param {string} director - Director name
 * @param {string} genre    - Genre (or empty string)
 * @param {string} notes    - Notes (or empty string)
 * @param {number} rating   - Rating 0–10
 */
function openEdit(id, title, director, genre, notes, rating) {
    document.getElementById('editForm').action = '/edit/' + id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDirector').value = director;
    document.getElementById('editGenre').value = genre;
    document.getElementById('editNotes').value = notes;

    // Clear all stars, then check the correct one
    document.querySelectorAll('#editStars input').forEach(r => r.checked = false);
    if (rating > 0) {
        const star = document.getElementById('edit-star' + rating);
        if (star) star.checked = true;
    }

    document.getElementById('editDialog').showModal();
}

/**
 * Close the Edit Movie dialog.
 */
function closeEditDialog() {
    document.getElementById('editDialog').close();
}
