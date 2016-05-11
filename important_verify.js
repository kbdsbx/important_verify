
"use strict"

$( document ).ready( function() {

    $.fn.tip = function( show, type ) {

        if ( $( '#inner-tip-style' ).length == 0 ) {
            $( '<style></style>' )
                .attr( 'id', 'inner-tip-style' )
                .attr( 'type', 'text/css' )
                .html( ".tooltip { position: absolute; z-index: 1070; display: block; font-size: 12px; font-style: normal; font-weight: 400; line-height: 1.42857143; text-align: left; text-align: start; text-decoration: none; text-shadow: none; text-transform: none; letter-spacing: normal; word-break: normal; word-spacing: normal; word-wrap: normal; white-space: normal; filter: alpha(opacity=0); opacity: 0; line-break: auto; background-color: #2C308A; padding: 3px 8px; border-radius: 5px; color: #FFF; } .tooltip:after { content: ' '; display: inline-block; position: absolute; left: calc(50% - 2.5px); top: 23px; border-top: 5px solid #2C308A; border-left: 5px solid transparent; border-right: 5px solid transparent;} .tooltip.show { opacity: 1; filter: alpha( opacity=100 ); }" )
                .appendTo( $( 'head' ) );
        }

        var _this = $( this );
        if ( show && ( _this.data( 'msg' ) || _this.data( 'msg-' + type ) ) && ! _this.data( 'tip' ) ) {
            var _v = $( '<div></div>' )
                .html( type ? _this.data( 'msg-' + type  ) : _this.data( 'msg' ) )
                .addClass( 'tooltip' )
                .css( 'left', _this.offset().left )
                .css( 'top', _this.offset().top - 28 );

            _this.data( 'tip', _v );
            _v.appendTo( 'body' );
            setTimeout( function() {
                _v.addClass( 'show' );
            }, 100 );
        }
        if ( ! show && _this.data( 'tip' ) ) {
            _this
                .data( 'tip' )
                .removeClass( 'show' );
            setTimeout( function() {
                _this.data( 'tip' ).remove();
                _this.data( 'tip', '' );
            }, 300 );
        }

        return _this;
    }

    function important_verify() {
        var _self = $( this );

        if ( $( '#inner-warning-style' ).length == 0 ) {
            $( '<style></style>' )
                .attr( 'id', 'inner-warning-style' )
                .attr( 'type', 'text/css' )
                .html( '.warning { border-color : #da2c27; background-color : #FFF3CD; }' )
                .appendTo( $( 'head' ) );
        }

        if ( _self.is( ':text, :password, input[type="email"], input[type="tel"], textarea:not(.multiple)' ) ) {
            if ( _self.val() == '' ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false );
                    } );
            }
            _self.on( 'focus', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false );
            } );
        }
        if ( _self.is( '.multiple' ) ) {
            var _text = _self.parent().find( '.file-input' );
            if ( tinymce.get( _self.attr( 'name' ) ).getContent() == '' ) {
                _text
                    .addClass( 'warning' )
                    .parent()
                        .on( 'mouseover', function() {
                            _self.tip( true );
                        } )
                        .on( 'mouseout', function() {
                            _self.tip( false );
                        } );
            }
            _self.parent().on( 'mouseover', function() {
                _text
                    .removeClass( 'warning' )
                    .tip( false )
                    .parent()
                        .off( 'mouseover' )
                        .off( 'mouseout' );
            } );
        }
        if ( _self.is( 'input[type="email"], .email' ) ) {
            if ( _self.val() != '' && ! /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test( _self.val() ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'email' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'email' );
                    } );
            }
            _self.on( 'focus', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'email' );
            } );
        }
        if ( _self.is( 'input[type="tel"], .tel' ) ) {
            if ( _self.val() != '' && ! /^[\d-]*$/.test( _self.val() ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'tel' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'tel' );
                    } );
            }
            _self.on( 'focus', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'tel' );
            } );
        }
        if ( _self.is( '[pattern]' ) ) {
            if ( ! RegExp( _self.attr( 'pattern' ) ).test( _self.val() ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'pattern' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'pattern' );
                    } );
            }
            _self.on( 'focus', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'pattern' );
            } );
        }
        if ( _self.is( '.select' ) ) {
            var _self = _self.find( 'span' );
            if ( _self.html().trim() == '&nbsp;' ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false );
                    } );
            }
           _self.on( 'click', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false );
            } );
        }
        if ( _self.is( ':file' ) ) {
            var _text = _self.parent().find( '.file-input' );
            if ( _self.get(0) && _self.get(0).files.length > 0 && _self.get(0).files[0].size > parseInt( _self.data( 'limit' ) ) ) {
                _text
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _text.tip( true, 'limit' );
                    } )
                    .on( 'mouseout', function() {
                        _text.tip( false, 'limit' );
                    } );
            }
            _self.on( 'change', function() {
                _text
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'limit' );
            } );
        }
        if ( _self.is( ':file' ) && _self.attr( 'accept' ) ) {
            var _text = _self.parent().find( '.file-input' );
            if( _self.get(0) && _self.get(0).files.length > 0 && _self.attr( 'accept' ).indexOf( _self.get(0).files[0].type ) == -1 ) {
                _text
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _text.tip( true, 'type' );
                    } )
                    .on( 'mouseout', function() {
                        _text.tip( false, 'type' );
                    } );
            }
            _self.on( 'change', function() {
                _text
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'type' );
            } );
        }

        if ( _self.is( '[maxlength]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'maxlength' ) ) && _self.val().length > _self.attr( 'maxlength' ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'maxlength' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'maxlength' );
                    } );
            }

            _self.on( 'change', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'maxlength' );
            } );
        }

        if ( _self.is( '[minlength]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'minlength' ) ) && _self.val().length < _self.attr( 'minlength' ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'minlength' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'minlength' );
                    } );
            }

            _self.on( 'change', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'minlength' );
            } );
        }
        
        if ( _self.is( '[min]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'min' ) ) && _self.val() < _self.attr( 'min' ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'min' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'min' );
                    } );
            }
            
            _self.on( 'change', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'min' );
            } );
        }
        
        if ( _self.is( '[max]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'max' ) ) && _self.val() > _self.attr( 'max' ) ) {
                _self
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, 'max' );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, 'max' );
                    } );
            }
            
            _self.on( 'change', function() {
                _self
                    .removeClass( 'warning' )
                    .off( 'mouseover' )
                    .off( 'mouseout' )
                    .tip( false, 'max' );
            } );
        }
    }

    $( '.important input:text, .important input:password, .important input[type="email"], .important .email, .important input[type="tel"], .important .tel, .important textarea, .important .select, .file-upload input:file' ).filter( ':not([disabled])' ).on( 'blur', important_verify );
    $( 'form' ).on( 'submit', function() {
        var _this = $( this );
        var _rv = true;

        _this.find( '.important input:text, .important input:password, .important input[type="email"], .important .email, .important input[type="tel"], .important .tel, .important textarea, .important .select, .file-upload input:file' ).filter( ':not([disabled])' ).each( important_verify );

        if ( _this.find( '.warning' ).length > 0 ) _rv = false;

        return _rv;
    } );

    var input_verify = function( _event ) {
        var _self = $( this );

        if ( _self.is( '[maxlength]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'maxlength' ) ) && _self.val().length > _self.attr( 'maxlength' ) ) {
                return false;
            }
        }

        if ( _self.is( '[type="tel"], .tel' ) ) {
            var c = _event.charCode;
            if ( ( c < 48 || c > 57 ) && c != 45 && c != 13 ) {
                return false;
            }
        }

        if ( _self.is( '[type="number"], .number' ) ) {
            var c = _event.charCode;
            // 0-9 E e + - . [enter]
            if ( ( c < 48 || c > 57 ) && c != 69 && c != 101 && c != 43 && c != 45 && c != 46 && c != 13 ) {
                return false;
            }
        }
    }

    $( '.input-verify' ).on( 'keypress', input_verify );
} );
