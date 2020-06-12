<h1><?php echo __('Openings Import Settings'); ?></h1>
<p>To run the import process <a href="/wp-admin/admin-ajax.php?action=hecc_do_import">click here<a></p>
<?php if ($updated) {
    echo "<div class='updated notice notice-success is-dismissible'>" . __('Settings Updated') . "</div>";
} ?>
<form method="POST">
<p>
    <h5><label for="import_src_url"><?php echo __('Source URL (REQUIRED)'); ?></label></h5>
    <input type="text" name="import_src_url" id="import_src_url" value="<?php echo $cfg->get_url(); ?>" />
</p>
<p>
    <h5><label for="import_username"><?php echo __('User Name (optional)'); ?></label></h5>
    <input type="text" name="import_username" id="import_username" value="<?php echo $cfg->get_user(); ?>" />
</p>
<p>
    <h5><label for="import_password"><?php echo __('Password (optional)'); ?></label></h5>
    <input type="text" name="import_password" id="import_password" value="<?php echo $cfg->get_password(); ?>" />
</p>
<input type="submit" value="<?php echo __('Save'); ?>" />
</form>