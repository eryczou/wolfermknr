exports.up = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('insight')
    .dropTableIfExists('notification')
    .dropTableIfExists('follow')
    .dropTableIfExists('post_mark')
    .dropTableIfExists('comment_mark')
    .dropTableIfExists('sub_comment')
    .dropTableIfExists('comment')
    .dropTableIfExists('music_collection')
    .dropTableIfExists('music')
    .dropTableIfExists('post_collection')
    .dropTableIfExists('post')
    .dropTableIfExists('profile')
    .dropTableIfExists('token')
    .dropTableIfExists('user')
    .raw(`CREATE TABLE user (
      user_id int(10) unsigned NOT NULL AUTO_INCREMENT,
      email varchar(63) NOT NULL,
      username varchar(63) DEFAULT NULL,
      password varchar(255) NOT NULL,
      verified tinyint(1) NOT NULL DEFAULT 0,
      access_level tinyint(1) NOT NULL DEFAULT 0,
      status tinyint(1) NOT NULL DEFAULT 0,
      last_login datetime DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_id),
      UNIQUE KEY user_email_unique (email),
      UNIQUE KEY user_username_unique (username),
      KEY user_email_index (email),
      KEY user_username_index (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE token (
      user_id int(10) unsigned NOT NULL,
      device varchar(63) NOT NULL,
      ip varchar(15) DEFAULT NULL,
      refresh_token varchar(255) NOT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_id, device),
      CONSTRAINT token_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE profile (
      user_id int(10) unsigned NOT NULL DEFAULT 0,
      type tinyint(1) NOT NULL DEFAULT '0',
      gender varchar(7) DEFAULT NULL,
      birthday varchar(11) DEFAULT NULL,
      headshot_url varchar(255) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_id),
      CONSTRAINT profile_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE post (
      post_id int(10) unsigned NOT NULL AUTO_INCREMENT,
      user_id int(10) unsigned NOT NULL,
      type tinyint(1) NOT NULL DEFAULT 0,
      music_ids varchar(255) DEFAULT NULL,
      slug varchar(127) DEFAULT NULL,
      post_title varchar(127) NOT NULL,
      post_body text NOT NULL,
      post_cover_url varchar(255) DEFAULT NULL,
      tag varchar(63) DEFAULT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (post_id),
      KEY post_user_id_foreign_idx (user_id),
      CONSTRAINT post_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE post_collection (
      user_id int(10) unsigned NOT NULL,
      post_id int(10) unsigned NOT NULL,
      status tinyint(1) NOT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_id,post_id),
      KEY post_collection_post_id_foreign_idx (post_id),
      KEY post_collection_user_id_foreign_idx (user_id),
      CONSTRAINT post_collection_post_id_foreign FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT post_collection_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE music (
      music_id int(10) unsigned NOT NULL AUTO_INCREMENT,
      user_id int(10) unsigned NOT NULL,
      tag varchar(63) DEFAULT NULL,
      music_title varchar(127) NOT NULL,
      music_author varchar(63) NOT NULL,
      music_url varchar(225) NOT NULL,
      music_sheet_url varchar(225) DEFAULT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (music_id),
      UNIQUE KEY music_id_UNIQUE (music_id),
      KEY music_user_id_foreign_idx (user_id),
      CONSTRAINT music_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE music_collection (
      user_id int(10) unsigned NOT NULL,
      music_id int(10) unsigned NOT NULL,
      status tinyint(1) NOT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_id,music_id),
      KEY music_collection_music_id_foreign_idx (music_id),
      KEY music_collection_user_id_foreign_idx (user_id),
      CONSTRAINT music_collection_music_id_foreign FOREIGN KEY (music_id) REFERENCES music (music_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT music_collection_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE comment (
      comment_id int(10) unsigned NOT NULL AUTO_INCREMENT,
      user_id int(10) unsigned NOT NULL,
      post_id int(10) unsigned NOT NULL,
      music_id int(10) unsigned DEFAULT NULL,
      comment_body varchar(1023) DEFAULT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (comment_id,user_id,post_id),
      UNIQUE KEY comment_id_UNIQUE (comment_id),
      CONSTRAINT comment_post_id_foreign FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT comment_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT comment_music_id_foreign FOREIGN KEY (music_id) REFERENCES music (music_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE sub_comment (
      sub_comment_id int(10) unsigned NOT NULL AUTO_INCREMENT,
      comment_id int(10) unsigned NOT NULL,
      user_id int(10) unsigned NOT NULL,
      comment_body varchar(1023) NOT NULL,
      status tinyint(1) NOT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (sub_comment_id),
      KEY sub_comment_user_id_foreign_idx (user_id),
      CONSTRAINT sub_comment_comment_id_foreign FOREIGN KEY (sub_comment_id) REFERENCES comment (comment_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT sub_comment_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE post_mark (
      post_id int(10) unsigned NOT NULL,
      user_id int(10) unsigned NOT NULL,
      mark_type tinyint(1) NOT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (post_id,user_id),
      KEY post_signature_user_id_foreign_idx (user_id),
      CONSTRAINT post_mark_post_id_foreign FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT post_mark_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE comment_mark (
      comment_id int(10) unsigned NOT NULL,
      user_id int(10) unsigned NOT NULL,
      mark_type tinyint(1) NOT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (comment_id,user_id),
      KEY user_id_idx (user_id),
      CONSTRAINT comment_mark_comment_id_foreign FOREIGN KEY (comment_id) REFERENCES comment (comment_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT comment_mark_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE follow (
      user_a int(10) unsigned NOT NULL,
      user_b int(10) unsigned NOT NULL,
      status tinyint(1) DEFAULT NULL,
      time_created datetime DEFAULT NULL,
      time_updated datetime DEFAULT NULL,
      PRIMARY KEY (user_a,user_b),
      UNIQUE KEY user_a_UNIQUE (user_a),
      UNIQUE KEY user_b_UNIQUE (user_b),
      CONSTRAINT user_a_user_id_foreign FOREIGN KEY (user_a) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT user_b_user_id_foreign FOREIGN KEY (user_b) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE notification (
      notification_id bigint(1) NOT NULL AUTO_INCREMENT,
      user_id int(10) unsigned NOT NULL,
      target_user_id int(10) unsigned NOT NULL,
      notification_type tinyint(1) unsigned NOT NULL,
      notification_body varchar(511) NOT NULL,
      status tinyint(1) NOT NULL,
      time_created varchar(45) DEFAULT NULL,
      time_updated varchar(45) DEFAULT NULL,
      PRIMARY KEY (notification_id),
      KEY user_id_user_id_foreign_idx (user_id),
      KEY target_user_id_user_id_foreign_idx (target_user_id),
      CONSTRAINT target_user_id_user_id_foreign FOREIGN KEY (target_user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT user_id_user_id_foreign FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .raw(`CREATE TABLE insight (
      user_id int(10) unsigned NOT NULL,
      post_count varchar(9) DEFAULT NULL,
      comment_count varchar(9) DEFAULT NULL,
      music_count varchar(9) DEFAULT NULL,
      follow_count varchar(9) DEFAULT NULL,
      follower_count varchar(9) DEFAULT NULL,
      PRIMARY KEY (user_id),
      CONSTRAINT insight_user_id_foreign_idx FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
    .then(function() {
      console.log(`
      user table created
      token table created
      profile table created
      post table created
      post_collection table created
      music table created
      music_collection table created
      comment table created
      sub_comment table created
      post_mark table created
      comment_mark table created
      follow table created
      notification table created
      insight table created
      `)
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('user')
    .then(function() {
      console.log('Users table dropped')
    })
}
