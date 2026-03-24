import { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';
import { Heading1, Heading2, Heading3, Image as ImageIcon, List, Quote, CheckSquare, Code, X, Settings } from 'lucide-react';

// --- Custom Image Blot ---
const ImageBlot = Quill.import('formats/image');
class ExtendedImageBlot extends ImageBlot {
    static create(value) {
        const src = typeof value === 'string' ? value : (value.src || value.url);
        let node = super.create(src || '');

        node.style.display = 'block';
        node.style.maxWidth = '100%';
        node.style.height = 'auto';
        node.style.borderRadius = '0.5rem';

        if (typeof value === 'object') {
            if (value.alt) node.setAttribute('alt', value.alt);
            if (value.title) node.setAttribute('title', value.title);
            if (value.width) node.style.width = value.width;

            const align = value.align || 'center';
            node.setAttribute('data-align', align);
            this.applyAlignStyles(node, align);
        } else {
            node.setAttribute('data-align', 'center');
            this.applyAlignStyles(node, 'center');
        }

        return node;
    }

    static applyAlignStyles(node, align) {
        node.classList.remove('align-left', 'align-center', 'align-right');
        node.classList.add(`align-${align}`);

        if (align === 'center') {
            node.style.setProperty('display', 'block', 'important');
            node.style.setProperty('float', 'none', 'important');
            node.style.setProperty('margin-left', 'auto', 'important');
            node.style.setProperty('margin-right', 'auto', 'important');
            node.style.setProperty('margin-top', '1.5rem', 'important');
            node.style.setProperty('margin-bottom', '1.5rem', 'important');
        } else if (align === 'left') {
            node.style.setProperty('display', 'inline', 'important');
            node.style.setProperty('float', 'left', 'important');
            node.style.setProperty('margin-left', '0', 'important');
            node.style.setProperty('margin-right', '1.5rem', 'important');
            node.style.setProperty('margin-top', '0.5rem', 'important');
            node.style.setProperty('margin-bottom', '1rem', 'important');
        } else if (align === 'right') {
            node.style.setProperty('display', 'inline', 'important');
            node.style.setProperty('float', 'right', 'important');
            node.style.setProperty('margin-left', '1.5rem', 'important');
            node.style.setProperty('margin-right', '0', 'important');
            node.style.setProperty('margin-top', '0.5rem', 'important');
            node.style.setProperty('margin-bottom', '1rem', 'important');
        }
    }

    static value(node) {
        const standardVal = super.value(node);
        const src = typeof standardVal === 'string' ? standardVal : node.getAttribute('src');

        return {
            src: src || '',
            alt: node.getAttribute('alt') || '',
            title: node.getAttribute('title') || '',
            width: node.style.width || node.getAttribute('width') || '',
            align: node.getAttribute('data-align') || 'center'
        };
    }

    static formats(node) {
        return {
            alt: node.getAttribute('alt'),
            title: node.getAttribute('title'),
            width: node.style.width,
            align: node.getAttribute('data-align')
        };
    }

    format(name, value) {
        if (name === 'align') {
            this.domNode.setAttribute('data-align', value);
            ExtendedImageBlot.applyAlignStyles(this.domNode, value);
        } else if (['alt', 'title', 'width'].includes(name)) {
            if (value) {
                if (name === 'width') this.domNode.style.width = value;
                else this.domNode.setAttribute(name, value);
            } else {
                if (name === 'width') this.domNode.style.width = '';
                else this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
ExtendedImageBlot.blotName = 'image';
ExtendedImageBlot.tagName = 'img';
Quill.register(ExtendedImageBlot, true);

// --- Slash Menu Component ---
const SlashMenu = ({ position, onSelect, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!position) return null;

    const items = [
        { id: 'h1', label: 'Heading 1', icon: Heading1, desc: 'Big section heading' },
        { id: 'h2', label: 'Heading 2', icon: Heading2, desc: 'Medium section heading' },
        { id: 'h3', label: 'Heading 3', icon: Heading3, desc: 'Small section heading' },
        { id: 'image', label: 'Image', icon: ImageIcon, desc: 'Upload an image' },
        { id: 'list-ul', label: 'Bullet List', icon: List, desc: 'Create a simple list' },
        { id: 'list-ol', label: 'Numbered List', icon: CheckSquare, desc: 'Create a numbered list' },
        { id: 'blockquote', label: 'Quote', icon: Quote, desc: 'Capture a quote' },
        { id: 'code-block', label: 'Code Block', icon: Code, desc: 'Capture a code snippet' },
    ];

    return (
        <div
            ref={menuRef}
            className="image-settings-modal-wrapper"
            style={{
                position: 'fixed',
                background: '#fff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                zIndex: 9999,
                width: '18rem',
                top: position.top + 30,
                left: position.left,
                fontFamily: 'Inter, system-ui, sans-serif'
            }}
        >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', background: '#f9fafb', padding: '0.5rem 0.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>BASIC BLOCKS</span>
                <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.125rem', borderRadius: '0.25rem', display: 'flex' }} onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><X size={12} /></button>
            </div>
            <div style={{ padding: '0.25rem 0', maxHeight: '300px', overflowY: 'auto' }}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(item.id)}
                        style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} 
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={{ width: '2.5rem', height: '2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', flexShrink: 0, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                            <item.icon size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{item.label}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Image Settings Modal ---
const ImageSettingsModal = ({ settings, position, onClose, onSave }) => {
    const [alt, setAlt] = useState(settings.alt || '');
    const [title, setTitle] = useState(settings.title || '');
    const [width, setWidth] = useState(settings.width || '');
    const [align, setAlign] = useState(settings.align || 'center');
    const modalRef = useRef(null);

    const [modalStyle, setModalStyle] = useState({
        top: position.top + position.height / 2, // Start roughly at image center
        left: position.left,
        visibility: 'hidden'
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (modalRef.current) {
                const modalRect = modalRef.current.getBoundingClientRect();
                let top = position.top + position.height + 10;
                let left = position.left - (modalRect.width / 2);

                if (top + modalRect.height > window.innerHeight - 20) {
                    const aboveTop = position.top - modalRect.height - 10;
                    top = aboveTop > 20 ? aboveTop : Math.max(20, window.innerHeight - modalRect.height - 20);
                }

                left = Math.max(20, Math.min(window.innerWidth - modalRect.width - 20, left));

                setModalStyle({
                    top,
                    left,
                    visibility: 'visible'
                });
            }
        }, 10); // Tiny delay to ensure DOM and bounds are stable
        return () => clearTimeout(timer);
    }, [position]);

    return (
        <div
            ref={modalRef}
            className="image-settings-modal-wrapper"
            style={{
                position: 'fixed',
                zIndex: 999999,
                background: '#fff',
                boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                border: '1px solid #f3f4f6',
                borderRadius: '1rem',
                padding: '1.5rem',
                width: '340px',
                top: modalStyle.top,
                left: modalStyle.left,
                visibility: modalStyle.visibility,
                fontFamily: 'Inter, system-ui, sans-serif'
            }}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={14} color="#3b82f6" />
                    Image Properties
                </span>
                <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: '0.25rem', borderRadius: '9999px' }} onMouseOver={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = '#f3f4f6'; }} onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgorund = 'transparent'; }}>
                    <X size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>Alt Text (SEO)</label>
                    <input type="text" value={alt} onChange={e => setAlt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSave({ alt, width, align }); } }} placeholder="Describe the image..." style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 500, outline: 'none', boxSizing: 'border-box' }} onFocus={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(96, 165, 250, 0.1)'; }} onBlur={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
                <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>Display Width</label>
                    <input type="text" value={width} onChange={e => setWidth(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSave({ alt, width, align }); } }} placeholder="e.g. 100%, 50%, or 400px" style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: '#f9fafb', color: '#374151', fontWeight: 500, outline: 'none', boxSizing: 'border-box' }} onFocus={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(96, 165, 250, 0.1)'; }} onBlur={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
                <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>Alignment</label>
                    <div style={{ display: 'flex', background: 'rgba(243, 244, 246, 0.8)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
                        {['left', 'center', 'right'].map(a => (
                            <button key={a} type="button" onClick={() => setAlign(a)} style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem 0', borderRadius: '0.5rem', textTransform: 'capitalize', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: align === a ? '#fff' : 'transparent', color: align === a ? '#2563eb' : '#6b7280', boxShadow: align === a ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none' }}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="button" onClick={() => onSave({ alt, width, align })} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem 0', background: 'linear-gradient(to right, #2563eb, #4f46e5)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(191, 219, 254, 1)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    Save Properties
                </button>
            </div>
        </div>
    );
};

// --- Main Editor Component ---
const RichTextEditor = ({ content, onChange, onImageUpload, height = "750px" }) => {
    const quillRef = useRef(null);
    const containerRef = useRef(null);
    const onImageUploadRef = useRef(onImageUpload);
    const [slashMenu, setSlashMenu] = useState({ visible: false, position: null });
    const [targetImage, setTargetImage] = useState(null);

    useEffect(() => {
        onImageUploadRef.current = onImageUpload;
    }, [onImageUpload]);

    useEffect(() => {
        const lastOpenTime = Date.now();
        const handleScroll = () => {
            // Ignore scroll for 250ms after opening any modal to prevent accidental dismissal from layout shifts
            if (Date.now() - lastOpenTime < 250) return;

            if (targetImage) setTargetImage(null);
            if (slashMenu.visible) setSlashMenu({ ...slashMenu, visible: false });
        };
        const editorRoot = quillRef.current?.getEditor()?.root;
        const mainContainer = document.querySelector('.flex-1.flex.flex-col.min-w-0.h-screen') || document.body;

        if (editorRoot) editorRoot.addEventListener('scroll', handleScroll);
        if (mainContainer) mainContainer.addEventListener('scroll', handleScroll);

        return () => {
            if (editorRoot) editorRoot.removeEventListener('scroll', handleScroll);
            if (mainContainer) mainContainer.removeEventListener('scroll', handleScroll);
        };
    }, [targetImage, slashMenu.visible]);

    // Custom Key Bindings
    const modules = useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }), []);

    const handleKeyUp = (e) => {
        if (e.target.closest('.image-settings-modal-wrapper')) return;
        if (targetImage) setTargetImage(null);
        
        if (e.key === '/') {
            setTimeout(() => {
                try {
                    const quill = quillRef.current.getEditor();
                    const selection = quill.getSelection();
                    if (selection) {
                        const bounds = quill.getBounds(selection.index);
                        const editorBounds = containerRef.current.getBoundingClientRect();
                        setSlashMenu({
                            visible: true,
                            position: {
                                top: editorBounds.top + bounds.top,
                                left: editorBounds.left + bounds.left
                            }
                        });
                    }
                } catch (err) {
                    console.error("Error showing slash menu:", err);
                }
            }, 10);
        } else {
            if (slashMenu.visible) setSlashMenu({ ...slashMenu, visible: false });
        }
    };

    const handleKeyDown = (e) => {
        if (e.target.closest('.image-settings-modal-wrapper')) return;
    };

    const handleSlashCommand = async (command) => {
        setSlashMenu({ ...slashMenu, visible: false });
        const quill = quillRef.current.getEditor();
        const selection = quill.getSelection();
        if (!selection) return;

        const textBefore = quill.getText(selection.index - 1, 1);
        if (textBefore === '/') {
            quill.deleteText(selection.index - 1, 1);
        }

        switch (command) {
            case 'h1': quill.format('header', 1); break;
            case 'h2': quill.format('header', 2); break;
            case 'h3': quill.format('header', 3); break;
            case 'list-ul': quill.format('list', 'bullet'); break;
            case 'list-ol': quill.format('list', 'ordered'); break;
            case 'blockquote': quill.format('blockquote', true); break;
            case 'code-block': quill.format('code-block', true); break;
            case 'image':
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = async () => {
                    const file = input.files[0];
                    if (file && onImageUploadRef.current) {
                        try {
                            const url = await onImageUploadRef.current(file);
                            if (url) quill.insertEmbed(selection.index - 1, 'image', url);
                        } catch (e) {
                            console.error('Image upload failed');
                        }
                    }
                };
                break;
            default: break;
        }
    };

    const handleEditorClick = (e) => {
        if (e.target.closest('.image-settings-modal-wrapper')) return;
        if (e.target.tagName === 'IMG') {
            setTimeout(() => {
                const quill = quillRef.current?.getEditor();
                if (!quill) return;
                const blot = Quill.find(e.target);
                if (blot) {
                    const bounds = e.target.getBoundingClientRect();
                    let value = blot.value();
                    if (typeof value === 'string') value = { src: value, alt: '', title: '', width: '', align: 'center' };
                    setTargetImage({
                        blot: blot,
                        node: e.target,
                        currentSettings: {
                            alt: value.alt || '',
                            title: value.title || '',
                            width: value.width || '',
                            align: value.align || 'center',
                        },
                        position: {
                            top: bounds.top,
                            left: bounds.left + (bounds.width / 2),
                            height: bounds.height
                        }
                    });
                }
            }, 10);
        } else {
            setTargetImage(null);
        }
    };

    const handleSaveImageSettings = (newSettings) => {
        if (!targetImage) return;
        const quill = quillRef.current.getEditor();
        let index = quill.getIndex(targetImage.blot);
        if (index < 0) {
            setTargetImage(null);
            return;
        }
        const currentBlotValue = targetImage.blot.value();
        const currentSrc = (typeof currentBlotValue === 'string' ? currentBlotValue : currentBlotValue.src)
            || targetImage.node.getAttribute('src') || targetImage.node.src;
        if (!currentSrc) {
            alert("Warning: Critical source error. Please re-insert the image.");
            setTargetImage(null);
            return;
        }
        const finalData = {
            ...(typeof currentBlotValue === 'object' ? currentBlotValue : {}),
            ...newSettings,
            src: currentSrc
        };
        quill.updateContents([
            { retain: index },
            { delete: 1 },
            { insert: { image: finalData } }
        ], 'user');
        setTargetImage(null);
    };

    return (
        <div ref={containerRef} className="rich-text-editor-container bg-white rounded-lg relative overflow-visible" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onClick={handleEditorClick}>
            <ReactQuill
                ref={quillRef}
                theme="bubble"
                value={content}
                onChange={onChange}
                modules={modules}
                bounds=".rich-text-editor-container"
                placeholder="Type something..."
                className="text-lg"
                style={{ minHeight: height }}
            />

            {slashMenu.visible && (
                <SlashMenu
                    position={slashMenu.position}
                    onSelect={handleSlashCommand}
                    onClose={() => setSlashMenu({ ...slashMenu, visible: false })}
                />
            )}

            {targetImage && (
                <ImageSettingsModal
                    settings={targetImage.currentSettings}
                    position={targetImage.position}
                    onClose={() => setTargetImage(null)}
                    onSave={handleSaveImageSettings}
                />
            )}

            <style>{`
                .rich-text-editor-container .ql-editor {
                    min-height: ${height};
                    height: auto;
                    overflow-y: visible;
                    padding: 2rem;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.8;
                    font-size: 1.125rem;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    white-space: pre-wrap !important;
                }
                .rich-text-editor-container .ql-editor * {
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    white-space: pre-wrap !important;
                }
                .rich-text-editor-container .ql-editor.ql-blank::before {
                    color: #9CA3AF;
                    font-style: normal;
                }
                .rich-text-editor-container .ql-container {
                    overflow: visible !important;
                }
                .rich-text-editor-container .ql-bubble .ql-tooltip {
                    z-index: 9999 !important;
                }
                .ql-tooltip.ql-bubble {
                    background-color: #1F2937 !important; 
                    border-radius: 8px !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    padding: 8px 12px !important;
                }
                .ql-bubble .ql-toolbar .ql-formats {
                    margin-right: 12px;
                }
                .ql-bubble .ql-stroke {
                    stroke: #E5E7EB !important; 
                }
                .ql-bubble .ql-fill {
                    fill: #E5E7EB !important;
                }
                .ql-bubble .ql-active .ql-stroke {
                    stroke: #60A5FA !important; 
                }
                .ql-bubble .ql-active .ql-fill {
                    fill: #60A5FA !important;
                }
                .ql-tooltip::-webkit-scrollbar {
                    display: none;
                }
                .ql-editor h1 { font-size: 2.5em; font-weight: 800; margin-top: 1em; margin-bottom: 0.5em; }
                .ql-editor h2 { font-size: 2em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; }
                .ql-editor h3 { font-size: 1.75em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; }
                .ql-editor img { cursor: pointer; transition: opacity 0.2s; outline: 3px solid transparent; outline-offset: 4px; border-radius: 0.5rem; }
                .ql-editor img:hover { opacity: 0.9; }
                .ql-editor blockquote { border-left: 4px solid #E5E7EB; padding-left: 1rem; color: #6B7280; font-style: italic; }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
