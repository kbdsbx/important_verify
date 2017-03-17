
"use strict"

$( document ).ready( function() {

    $.fn.tip = function( show, type ) {

        $.each( $( this ), function() {

            if ( $( '#inner-tip-style' ).length == 0 ) {
                $( '<style></style>' )
                    .attr( 'id', 'inner-tip-style' )
                    .attr( 'type', 'text/css' )
                    .html( ".tooltip { position: absolute; z-index: 1070; display: block; font-size: 12px; font-style: normal; font-weight: 400; line-height: 1.42857143; text-align: left; text-align: start; text-decoration: none; text-shadow: none; text-transform: none; letter-spacing: normal; word-break: normal; word-spacing: normal; word-wrap: normal; white-space: normal; filter: alpha(opacity=0); opacity: 0; line-break: auto; background-color: #F8B62C; padding: 3px 8px; border-radius: 5px; color: #FFF; } .tooltip:after { content: ' '; display: inline-block; position: absolute; left: calc(50% - 2.5px); top: 23px; border-top: 5px solid #F8B62C; border-left: 5px solid transparent; border-right: 5px solid transparent;} .tooltip.show { opacity: 1; filter: alpha( opacity=100 ); }" )
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
                    if ( _this.data( 'tip' ) ) {
                        _this
                            .data( 'tip' )
                            .remove();
                        _this.data( 'tip', '' );
                    }
                }, 300 );
            }

        } );

        return $( this );
    }

    $.fn._set_warning_event = function ( type ) {
        var _self = $( this );
        _self
            .addClass( 'warning' )
            .on( 'mouseover', function() {
                _self.tip( true, type );
            } )
            .on( 'mouseout', function() {
                _self.tip( false, type );
            } );
        _self.triggerHandler( 'verify.error', {
            'type' : type,
        } );
    }

    $.fn._remove_warning_event = function ( type ) {
        var _self = $( this );
        _self
            .removeClass( 'warning' )
            .off( 'mouseover' )
            .off( 'mouseout' )
            .tip( false, type );

        _self.triggerHandler( 'verify.change', {
            'type' : type,
        } );
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

        // 非空
        if ( _self.is( ':text, :password, input[type="email"], input[type="tel"], textarea:not(.multiple)' ) ) {
            if ( _self.val() == '' ) {
                _self._set_warning_event();
            }
            _self.off( 'focus' ).on( 'focus', function() {
                _self._remove_warning_event();
            } );
            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event();
            } );
        }
        // 富文本
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
        // 邮箱格式
        if ( _self.is( 'input[type="email"], .email' ) ) {
            if ( _self.val() != '' && ! /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test( _self.val() ) ) {
                _self._set_warning_event( 'email' );
            }
            _self.off( 'focus' ).on( 'focus', function() {
                _self._remove_warning_event( 'email' );
            } );
        }
        /*
        if ( _self.is( 'input[type="tel"], .tel' ) ) {
            if ( _self.val() != '' && ! /^[\d-]*$/.test( _self.val() ) ) {
                _self._set_warning_event( 'tel' )
            }
            _self.on( 'focus', function() {
                _self._remove_warning_event( 'tel' );
            } );
        }
        */
        // 正则
        if ( _self.is( '[pattern]' ) ) {
            if ( ! RegExp( _self.attr( 'pattern' ), 'i' ).test( _self.val() ) ) {
                _self._set_warning_event( 'pattern' );
            }
            _self.off( 'focus' ).on( 'focus', function() {
                _self._remove_warning_event( 'pattern' );
            } );
        }
        // 选择控件非空
        if ( _self.is( '.select' ) ) {
            var _self = _self.find( 'span' );
            if ( _self.html().trim() == '&nbsp;' ) {
                _self._set_warning_event();
            }
           _self.off( 'click' ).on( 'click', function() {
                _self._remove_warning_event();
            } );
        }
        // 文件非空
        if ( _self.is( ':file' ) ) {
            var _text = _self.parent().find( '.file-input' );
            if ( _self.get(0) && _self.get(0).files.length > 0 && _self.get(0).files[0].size > parseInt( _self.data( 'limit' ) ) ) {
                _text._set_warning_event( 'limit' );
            }
            _self.off( 'change' ).on( 'change', function() {
                _text._remove_warning_event( 'limit' );
            } );
        }
        if ( _self.is( ':file' ) && _self.attr( 'accept' ) ) {
            var _text = _self.parent().find( '.file-input' );
            if( _self.get(0) && _self.get(0).files.length > 0 && _self.attr( 'accept' ).indexOf( _self.get(0).files[0].type ) == -1 ) {
                _text._set_warning_event( 'type' );
            }
            _self.off( 'change' ).on( 'change', function() {
                _text._remove_warning_event( 'type' );
            } );
        }

        // 最大长度
        if ( _self.is( '[maxlength]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'maxlength' ) ) && _self.val().length > _self.attr( 'maxlength' ) ) {
                _self._set_warning_event( 'maxlength' );
            }

            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event( 'maxlength' );
            } );
        }

        // 最小长度
        if ( _self.is( '[minlength]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'minlength' ) ) && _self.val().length < _self.attr( 'minlength' ) ) {
                _self._set_warning_event( 'minlength' );
            }

            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event( 'minlength' );
            } );
        }
        
        // 最小值（数字）
        if ( _self.is( '[min]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'min' ) ) && _self.val() < _self.attr( 'min' ) ) {
                _self._set_warning_event( 'min' );
            }
            
            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event( 'min' );
            } );
        }
        
        // 最大值（数字）
        if ( _self.is( '[max]' ) ) {
            if ( _self.val() != '' && NaN !== parseInt( _self.attr( 'max' ) ) && _self.val() > _self.attr( 'max' ) ) {
                _self._set_warning_event( 'max' );
            }
            
            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event( 'max' );
            } );
        }

        // 关键词过滤
        if ( _self.is( '[keywordfiltering]' ) ) {
            if ( _self.val() != '' ) {
                for ( var idx = 0; idx < items.length; idx++ ) {
                    var item = items[idx].split( '=' )[0];

                    if ( "undefined" != typeof item && item.trim().length > 0 && new RegExp( item, 'i' ).test( _self.val() ) ) {
                        _self._set_warning_event( 'keywordfiltering' );


                        if ( "undefined" !== typeof UDM ) {
                            UDM.evq.push( ['trackEvent', 'keyword-filter', item.trim(), item.trim()] );
                        }
                        break;
                    }
                }

                _self.off( 'change' ).on( 'change', function() {
                    _self._remove_warning_event( 'keywordfiltering' );
                } );
            }
        }

        // 内容过滤
        if ( _self.is( '[contentfiltering]' ) ) {
            var _val = _self.val();
            if ( _val != '' ) {
                var filtering = _self.attr( 'contentfiltering' ).split( ',' );

                for ( var idx = 0; idx < filtering.length; idx++ ) {
                    switch( filtering[idx] ) {
                    case 'number':
                        if ( /^\d+$/i.test( _val ) ) {
                            _self._set_warning_event( 'contentfiltering' );
                        }
                        break;
                    case 'letter':
                        if ( /^[a-zA-Z\s]+$/i.test( _val ) ) {
                            _self._set_warning_event( 'contentfiltering' );
                        }
                        break;
                    case 'interpunction':
                        if ( /^[\.,\/\\<>\?:;'"\{\}\[\]\+=\(\)\*&\^%$#@!\s]+$/i.test( _val ) ) {
                            _self._set_warning_event( 'contentfiltering' );
                        }
                        break;
                    case 'url':
                        if ( /(https?:\/\/)?(\w+)?\.?\w+\.\w{2,}/g.test( _val ) ) {
                            _self._set_warning_event( 'contentfiltering' );
                        }
                        break;
                    case 'chinese' :
                        if ( ! /[\u4e00-\u9fa5]+/g.test( _val ) ) {
                            _self._set_warning_event( 'contentfiltering' );
                        }
                        break;
                    }
                }
                
                _self.off( 'change' ).on( 'change', function() {
                    _self._remove_warning_event( 'contentfiltering' );
                } );
            }
        }

        // 单选非空
        if ( _self.is( '[type="radio"], .radio' ) ) {
            var _target = $( '[name="' + _self.attr( 'name' ) + '"]' );
            if ( _self.find( '+ a' ).is( ':not(:hidden)' ) && ! _target.is( ':checked' ) ) {

                _self.find( '+ a' )
                    ._set_warning_event();
                /*
                _self.find( '+ a span' )
                    .addClass( 'warning' )
                    .on( 'mouseover', function() {
                        _self.tip( true, null );
                    } )
                    .on( 'mouseout', function() {
                        _self.tip( false, null );
                    } );
                    */
            }

            _target.find( '+ a' ).on( 'click', function() {
                _target.find( '+ a' )._remove_warning_event();
            } );
        }

        // 多选非空
        if ( _self.is( '[type="checkbox"], .checkbox' ) ) {
            var _target = $( '[name="' + _self.attr( 'name' ) + '"]' );
            if ( _self.find( '+ a' ).is( ':not(:hidden)' ) && ! _target.is( ':checked' ) ) {

                _self.find( '+ a' )
                    ._set_warning_event();
            }

            _target.find( '+ a' ).on( 'click', function() {
                _target.find( '+ a' )._remove_warning_event();
            } );
        }

        // 下拉非空
        if ( _self.is( '.select, select' ) ) {
            if ( _self.val() == '0' ) {
                _self._set_warning_event();
            }
            
            _self.off( 'change' ).on( 'change', function() {
                _self._remove_warning_event();
            } );
        }

    }

    if ( window.blur_verify ) {
        $( '.important input:text, .important input:password, .important input[type="email"], .important .email, .important input[type="tel"], .important .tel, .important textarea, .important .select, .important select, .file-upload input:file' )
            .filter( ':not([disabled])' )
            .on( 'blur', important_verify );
    }

    $( 'form' ).on( 'submit', function() {
        var _this = $( this );
        var _rv = true;

        _this.find( '.important input:text:not(:hidden), .important input:password:not(:hidden), .important input[type="email"]:not(:hidden), .important .email:not(:hidden), .important input[type="tel"]:not(:hidden), .important .tel:not(:hidden), .important textarea:not(:hidden), .important .select:not(:hidden), .important select:not(:hidden), .file-upload input:file:not(:hidden), .important .radio, .important input[type="radio"], .important .checkbox, .important input[type="checkbox"]' )
            .filter( ':not([disabled])' )
            .each( important_verify );

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
            if ( ( c < 48 || c > 57 ) && c != 45 && c != 13 && c != 8 && c != 0 && c != 40 && c != 41 && c != 43 && c != 32 ) {
                return false;
            }
        }

        if ( _self.is( '[type="number"], .number' ) ) {
            var c = _event.charCode;
            // 0-9 E e + - . [enter]
            if ( ( c < 48 || c > 57 ) && c != 69 && c != 101 && c != 43 && c != 45 && c != 46 && c != 13 && c != 8 && c != 0 ) {
                return false;
            }
        }
    }

    var select_verify = function( _event ) {
        var _self = $( this );
        var _target = $( this ).parent().find( '[data-check-count]' );
        
        if ( _target.is( '[data-check-count]' ) ) {
            if ( $( '[name="' + _target.attr( 'name' ) + '"]:checked' ).length > parseInt( _target.attr( 'data-check-count' ) ) ) {
                _target.find( '+ a' )
                    ._set_warning_event( 'count' );
                _target.removeAttr( 'checked' );
            }

            _target.find( '+ a' ).on( 'click', function() {
                _target.find( '+ a' )._remove_warning_event( 'count' );
            } );
        }
    }

    $( '.input-verify' ).on( 'keypress', input_verify );

    $( '[data-check-count] + a' ).on( 'click', select_verify );

    $.fn.verify = function() {
        $( this ).find( '.important input:text:not(:hidden), .important input:password:not(:hidden), .important input[type="email"]:not(:hidden), .important .email:not(:hidden), .important input[type="tel"]:not(:hidden), .important .tel:not(:hidden), .important textarea:not(:hidden), .important .select:not(:hidden), .important select:not(:hidden), .important .file-upload input:file:not(:hidden), .important .radio, .important input[type="radio"], .important .checkbox, .important input[type="checkbox"]' )
            .filter( ':not([disabled])' )
            .each( important_verify );

        return $( this ).find( '.warning' ).length == 0;
    }

    var items = [];

    if ( $( '[keywordfiltering]' ).length > 0 ) {
        $.ajax( {
            url : $( '[keywordfiltering]' ).attr( 'keywordfiltering' ),
            dataType : 'text',
            cache : true,
            type : 'get',
            success : function( txt ) {
                if ( txt ) {
                    items = txt.split( '\r\n' );
                }
            }
        } );
    }
} );
$( 'textarea' ).on( 'verify.error', function( e, o ) {
    //
    // obj: { type : "[minlength / maxlength / min / max / contentfiltering / keywordfiltering ... ]" }
    //
} );
