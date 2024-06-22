import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrl: './cat.component.css'
})
export class CatComponent implements OnInit {

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>
  @Input() CatTurn:boolean=false
  @Input() CatWin:boolean=false
  @Input() CatLost:boolean=false
  @Input() NewGame:boolean=false
  private glif!: GLTF;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animations: { [key: string]: THREE.AnimationAction } = {};
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private currentAnimationAction: string

  async ngOnInit(): Promise<void> {
    try {
      this.glif = await this.loadGLTFModel();
      this.initScene();
      this.animate();
    } catch (error) {
      console.error('Error loading GLTF model:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['CatTurn'] && this.CatTurn) {
      this.catTurn();
    }
     else if (changes['CatWin'] && this.CatWin) {
      this.catWin();
    }
     else if (changes['CatLost'] && this.CatLost) {
      this.catLost();
    }
    else if(changes['NewGame'] && this.NewGame){
      
      this.newGame();
    }
  }

  private async loadGLTFModel(): Promise<GLTF> {
    return new Promise<GLTF>((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load('assets/scene.gltf', (gltf) => {
        resolve(gltf);
      }, undefined, (error) => {
        console.error('Failed to load GLTF model:', error);
        reject(error);
      });
    });
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const model = this.glif.scene;
    model.scale.set(4, 4, 4);
    this.scene.add(model);

    // Initialize AnimationMixer
    this.mixer = new THREE.AnimationMixer(model);

    // Load or assign animations
    this.glif.animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      this.animations[clip.name] = action;
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Soft white light
    this.scene.add(ambientLight);
    this.camera.position.z = 5;
    this.scene.background = new THREE.Color(0xeeeeee); // Light gray background

    this.playAnimation('02_Idle_LittleFriends');
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    this.renderer.render(this.scene, this.camera);
  };

  private playAnimation(name: string) {
    this.stopCurrentAnimation();
    if (this.animations[name]) {
      this.currentAnimationAction =name
       this.animations[name].reset().play();
    }
  }
  private stopCurrentAnimation() {
    if (this.currentAnimationAction) {
      this.animations[this.currentAnimationAction].stop();
      this.currentAnimationAction = '';
    }
  }
  public catTurn() {
    this.playAnimation('07_Eat_LittleFriends');
    setTimeout(() => {
      this.animations['07_Eat_LittleFriends'].stop();
      this.playAnimation('02_Idle_LittleFriends');
    }, 2000);
  }

  public catWin() {
    this.playAnimation('05_Jump_LittleFriends'); 
  }

  public catLost() {
    this.playAnimation('09_Sleep02_LittleFriends'); 
    setTimeout(() => {
      this.animations['09_Sleep02_LittleFriends'].stop();
      this.playAnimation('10_Sleep03_LittleFriends');
    }, 1000);
  }
 
  public newGame(){
    this.playAnimation('02_Idle_LittleFriends')
  }
}
