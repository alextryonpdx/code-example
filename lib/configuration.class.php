<?php
class HECC_Configuration {
    function __construct() {
        $this->load_configuration();
    }
    
    private function load_configuration() {
        $this->url = get_option('hecc_remote_url');
        $this->user = get_option('hecc_remote_user');
        $this->passwd = get_option('hecc_remote_password');
    }
    
    public function save_values() {
        $updated = false;
        if ($_POST) {
            if ($_POST['import_src_url']) {
                update_option('hecc_remote_url', $_POST['import_src_url']);
                $updated = true;
            }
            if ($_POST['import_username']) {
                update_option('hecc_remote_user', $_POST['import_username']);
                $updated = true;
            }
            if ($_POST['import_password']) {
                update_option('hecc_remote_password', $_POST['import_password']);
                $updated = true;
            }
        }
        if ($updated) {
            $this->load_configuration();
        }
        return $updated;
    }
    
    public function get_url() {
        return $this->url;
    }
    
    public function get_user() {
        return $this->user;
    }
    
    public function get_password() {
        return $this->passwd;
    }
}
