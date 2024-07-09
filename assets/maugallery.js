// $ remplace jQuery
(function($) {
  // Création de la galerie
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        // Création de la modale appelée lightbox
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  // Définition des valeurs par défaut de la modal
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  // Gestion des clics sur les éléments et les boutons de navigation
    $.fn.mauGallery.listeners = function(options) {
      $(".gallery-item").on("click", function() {
        if (options.lightBox && $(this).prop("tagName") === "IMG") {
          $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
        } else {
          return;
        }
      });

      $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
      $(".gallery").on("click", ".mg-prev", () =>
        $.fn.mauGallery.methods.prevImage(options.lightboxId)
      );
      $(".gallery").on("click", ".mg-next", () =>
        $.fn.mauGallery.methods.nextImage(options.lightboxId)
      );
    };
  $.fn.mauGallery.methods = {
    // Crée un conteneur row
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    // Ajoute des classes colonnes bootstrap
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    // Déplace l'élément dans le conteneur "gallery-items-row"
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    // Ajoute une class "img-fluid" a une classe
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    // Ouvre la modal
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    
    
    // Image précédente dans la modal
    // Version donné dans le git
    /*prevImage() {
      let activeImage = null;
      $("img.gallery-item:visible").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i ;
        }
      });
      next =
        imagesCollection[index] ||
        imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },*/
    //Version débuggé
    prevImage() {
      let activeImage = null;
      const visibleImages = $("img.gallery-item:visible");
      
      // Trouve l'image active visible
      visibleImages.each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
    
      // Crée une collection d'images visibles
      let imagesCollection = [];
      visibleImages.each(function() {
        imagesCollection.push($(this));
      });
    
      // Trouve l'index de l'image active
      let index = -1;
      for (let i = 0; i < imagesCollection.length; i++) {
        if (imagesCollection[i].attr("src") === activeImage.attr("src")) {
          index = i;
          break;
        }
      }
    
      // Calcule l'index de l'image précédente
      index = (index - 1 + imagesCollection.length) % imagesCollection.length;
    
      // Trouve l'image précédente
      let prevImage = imagesCollection[index];
    
      // Met à jour la source de l'image dans la lightbox
      $(".lightboxImage").attr("src", prevImage.attr("src"));
    },
    

    // Image suivante dans la modal
    // Version donnée dans le git
    /*nextImage() {
      let activeImage = null;
      $("img.gallery-item:visible").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },*/
    //Version débuggé
    nextImage() {
      let activeImage = null;
      const visibleImages = $("img.gallery-item:visible");
    
      // Trouve l'image active visible
      visibleImages.each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
    
      // Crée une collection d'images visibles
      let imagesCollection = [];
      visibleImages.each(function() {
        imagesCollection.push($(this));
      });
    
      // Trouve l'index de l'image active
      let index = -1;
      for (let i = 0; i < imagesCollection.length; i++) {
        if (imagesCollection[i].attr("src") === activeImage.attr("src")) {
          index = i;
          break;
        }
      }
    
      // Calcule l'index de l'image suivante
      index = (index + 1) % imagesCollection.length;
    
      // Trouve l'image suivante
      let nextImage = imagesCollection[index];
    
      // Met à jour la source de l'image dans la lightbox
      $(".lightboxImage").attr("src", nextImage.attr("src"));
    },
    

    // Crée la modal
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },
    // Affiche les tags pour filtrer
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    // Filtre par tag
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      // $(".active-tag").removeClass("active active-tag");
      $(".nav-link").removeClass("active active-tag");
      //$(this).addClass("active-tag");
      $(this).addClass("active");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);
