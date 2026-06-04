import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CourseCard.module.css';

const levelColor = { basico:'#27ae60', intermedio:'#f39c12', avanzado:'#e74c3c' };
const stateColor = { publicado:'#27ae60', pendiente:'#f39c12', borrador:'#95a5a6', rechazado:'#e74c3c' };

export default function CourseCard({ course, actions, to }) {
  return (
    <div className={styles.card}>
      <div className={styles.header} style={{background: 'linear-gradient(135deg, #1e3a5f, #2e6da4)'}}>
        <span className={styles.icon}>📖</span>
        {course.estado && (
          <span className={styles.badge} style={{background: stateColor[course.estado] || '#888'}}>
            {course.estado}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{course.titulo}</h3>
        <p className={styles.desc}>{course.descripcion?.slice(0,100)}...</p>
        <div className={styles.meta}>
          <span className={styles.level} style={{color: levelColor[course.nivel]||'#888'}}>
            ● {course.nivel}
          </span>
          <span className={styles.hours}>⏱ {course.duracion_horas}h</span>
          <span className={styles.students}>👥 {course.total_inscritos}</span>
        </div>
        {course.tutor_info && (
          <p className={styles.tutor}>👨‍🏫 {course.tutor_info.full_name}</p>
        )}
        <div className={styles.actions}>
          {to && <Link to={to} className={styles.btnPrimary}>Ver curso</Link>}
          {actions}
        </div>
      </div>
    </div>
  );
}
