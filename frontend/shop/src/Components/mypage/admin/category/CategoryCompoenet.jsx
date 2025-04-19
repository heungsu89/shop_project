import React, { useState, useEffect } from 'react';
import { createCategory, categoryList, categoryModify, categoryDelete } from '../../../../api/categoryApi';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';



const DroppableRoot = ({ children }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: "itemRoot", // 루트 droppable ID
    });
  
    return (
      <div ref={setNodeRef} className="categoryItemWrap" id="itemRoot"
        style={{
            padding: "19px 19px 100px", // 여기가 작동해야 함
            // border: "2px dashed #aaa",
            backgroundColor: isOver ? "#e0f7fa" : "#f9f9f9", // 드롭할 때 시각적 효과
            transition: "0.3s",
        }}
        >
        {children}
      </div>
    );
  };

const DraggableCategory = ({ category, onEdit, onDelete }) => {
    const isDraggable = !category.child || category.child.length === 0;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: category.id,
        disabled: !isDraggable,
      });
  
    const style = {
      transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      opacity: isDraggable ? 1 : 0.5, // 드래그 불가능하면 흐리게
    // pointerEvents: isDraggable ? 'auto' : 'none',
    //   padding: '10px',
    //   border: '1px solid #ccc',
    //   marginBottom: '5px',
    //   background: '#fff',
    //   display: 'flex',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   gap: '10px'
    };
  
    return (
      <div className='childItem' ref={setNodeRef} style={style}>
        <div className='categoryItem'>
            <div {...listeners} {...attributes} style={{ cursor: 'grab', flexGrow: 1 }}>
            {category.categoryName}
            </div>
    
            <button onClick={(e) => {
            e.stopPropagation();
            onEdit(category.id, category.categoryName);
            }}>분류명 수정</button>
    
            <button onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
            }}>삭제</button>
        </div>
      </div>
    );
  };

const DroppableCategory = ({ category, children }) => {
  const { setNodeRef } = useDroppable({
    id: category.id,
  });

  return (
    <div ref={setNodeRef} className="categoryItemBox droppable">
      {children}
    </div>
  );
};

const CategoryComponent = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ categoryName: '', parentId: null, viewStatus: false });
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = () => {
      categoryList().then(data => setCategories(data));
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };
  
    const validateForm = () => {
      if (!form.categoryName) {
        alert("분류명을 입력해주세요");
        return false;
      }
      return true;
    };
  
    const handleSubmit = () => {
      if (!validateForm()) return;
      createCategory(form).then(() => {
        setForm({ categoryName: '', parentId: null, viewStatus: false });
        fetchCategories();
        window.dispatchEvent(new Event('categoryUpdated')); // ✅ 이벤트 발생
      });
    };
  
    const handleEdit = (id, name) => {
      setEditingId(id);
      setEditingName(name);
    };
  
    const handleEditChange = (e) => {
      setEditingName(e.target.value);
    };
  
    const handleEditSave = (id) => {
      const payload = { categoryId: id, categoryName: editingName, parentId: null };
      categoryModify(payload).then(() => {
        alert('수정되었습니다.');
        setEditingId(null);
        setEditingName('');
        fetchCategories();
        window.dispatchEvent(new Event('categoryUpdated'));
      });
    };
  
    const handleEditCancel = () => {
      setEditingId(null);
      setEditingName('');
    };
  
    const handleDelete = (id) => {
      categoryDelete(id).then(() => {
        alert('삭제 되었습니다.');
        fetchCategories();
        window.dispatchEvent(new Event('categoryUpdated'));
      });
    };
  
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
      
        const draggedId = active.id;
        const targetId = over.id;
      
        // 현재 카테고리에서 끌려온 항목을 찾음 (상위 or 하위 포함)
        const dragged = categories.find(c => c.id === draggedId) ||
                        categories.flatMap(c => c.child || []).find(c => c.id === draggedId);
      
        // ❗ 드롭 대상이 루트(drop 영역)인지 아닌지 확인
        const isDropOnRoot = targetId === "itemRoot";
      
        // 상위 항목 찾기 (루트 영역이 아니면만)
        const target = isDropOnRoot ? null : categories.find(c => c.id === targetId);
      
        // 1. 자기 자신에게 드롭하면 무시
        if (draggedId === targetId) return;
      
        // 2. 하위가 있는 카테고리는 드래그 불가 (상위만 드래그 가능)
        if (dragged?.child?.length > 0) {
          alert("하위 카테고리가 있는 항목은 이동할 수 없습니다.");
          return;
        }
      
        // 3. 유효하지 않은 대상이면 무시
        if (!dragged) {
          console.warn("드래그된 항목을 찾을 수 없습니다.");
          return;
        }
      
        // 최종 payload 구성
        const payload = {
          categoryId: draggedId,
          categoryName: dragged.categoryName,
          parentId: isDropOnRoot ? null : targetId
        };
      
        categoryModify(payload).then(() => {
          // alert("카테고리 이동 완료");
          fetchCategories();
        });
      };
    return (
      <div className="myPageComponent">
        <h2 className="papgeTitle">분류</h2>
        <div className="pageContainer">
  
          <div className="borderSection">
            <div className='inputWrap'>
              <div className="inputTitle">분류등록</div>
              <div className="inputBox">
                <input
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  placeholder="분류명을 입력해주세요."
                  type="text"
                />
                <button type="button" onClick={handleSubmit}>분류등록</button>
              </div>
            </div>
          </div>
  
          <div className="borderSection">
            <div className='inputWrap'>
              <div className="inputTitle">분류관리</div>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <DroppableRoot>
                    {categories.length > 0 ? (
                    categories.map((data) => (
                        <DroppableCategory key={data.id} category={data}>
                        {editingId === data.id ? (
                            <div className="categoryItem">
                            <input type="text" value={editingName} onChange={handleEditChange} />
                            <button onClick={() => handleEditSave(data.id)}>저장</button>
                            <button onClick={handleEditCancel}>취소</button>
                            </div>
                        ) : (
                            <>
                            <DraggableCategory
                                category={data}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            {data.child && data.child.length > 0 && (
                                <div className="childCategoryWrap">
                                {data.child.map((child) => (
                                    <DraggableCategory
                                        key={child.id}
                                        category={child}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                                </div>
                            )}
                            </>
                        )}
                        </DroppableCategory>
                    ))
                    ) : (
                    <div>등록된 분류가 없습니다.</div>
                    )}
                </DroppableRoot>
            </DndContext>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default CategoryComponent;
  