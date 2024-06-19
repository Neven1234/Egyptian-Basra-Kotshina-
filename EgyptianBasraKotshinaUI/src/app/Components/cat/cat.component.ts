import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrl: './cat.component.css'
})
export class CatComponent implements OnInit {

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>
  glif:GLTF
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animations: { [key: string]: THREE.AnimationAction } = {};
  async ngOnInit(): Promise<void> {
    try {
      this.glif = await this.loadGLTFModel();
    } catch (error) {
      console.error('Error loading GLTF model:', error);
    }

  }

  private async loadGLTFModel(): Promise<GLTF> {
    return new Promise<GLTF>((resolve, reject) => {
      const scene = new THREE.Scene();
      if (typeof window !== "undefined") {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
        renderer.setSize(window.innerWidth, window.innerHeight);
  
        const loader = new GLTFLoader();
        loader.load('assets/scene.gltf', (gltf) => {
         this.glif=gltf
          const model = gltf.scene;
          model.scale.set(4, 4, 4);
          scene.add(model);
  
          // Initialize AnimationMixer
          this.mixer = new THREE.AnimationMixer(model);
  
          // Load or assign animations
          gltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.animations[clip.name] = action;
          });
  
          // Animation loop
          const animate = () => {
            requestAnimationFrame(animate);
  
            const delta = this.clock.getDelta();
            if (this.mixer) this.mixer.update(delta);
  
            renderer.render(scene, camera);
          };
          this.playAnimation('02_Idle_LittleFriends')
          resolve(gltf);
          animate();
        }, undefined, (error) => {
          console.error('Failed to load GLTF model:', error);
        });
  
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Soft white light
        scene.add(ambientLight);
        camera.position.z = 5;
        scene.background = new THREE.Color(0xeeeeee); // Light gray background
        return this.glif
      }
      return this.glif
    })
  }
  private playAnimation(name: string) {
    if (this.animations[name]) {
      this.animations[name].reset().play();
    }
  }

 
}
