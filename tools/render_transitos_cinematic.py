"""TransitOS cinematic render. Blender 4.2+.
Usage: blender -b -t 8 --python tools/render_transitos_cinematic.py -- /absolute/path/to/licensed-van.glb
Outputs frames to renders/transitos/; encode to MP4 after reviewing.
This deliberately fails if no real licensed vehicle mesh is provided.
"""
import bpy, sys, math, os
from mathutils import Vector
args = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
if not args or not os.path.isfile(args[0]) or not args[0].lower().endswith(".glb"):
    raise SystemExit("ERROR: Provide a real, licensed GLB vehicle asset. No primitive placeholder will be rendered.")
model_path = os.path.abspath(args[0])
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=model_path)
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not meshes: raise SystemExit("ERROR: GLB contains no vehicle meshes")
from mathutils import Vector
corners = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
minimum = Vector(tuple(min(v[i] for v in corners) for i in range(3)))
maximum = Vector(tuple(max(v[i] for v in corners) for i in range(3)))
center = (minimum+maximum)*0.5
extent = maximum-minimum
scale = 5.7/max(extent)
for o in list(bpy.context.scene.objects):
    if o.parent is None and o.type != "CAMERA":
        o.location -= center
        o.scale *= scale
bpy.context.view_layer.update()
corners = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
low_z = min(v.z for v in corners)
for o in bpy.context.scene.objects:
    if o.parent is None and o.type != "CAMERA": o.location.z -= low_z
bpy.context.view_layer.update()
def material(name, color, metallic=0, roughness=.3, emission=None, strength=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    bs=m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value=(*color,1)
    bs.inputs["Metallic"].default_value=metallic
    bs.inputs["Roughness"].default_value=roughness
    if emission:
        bs.inputs["Emission Color"].default_value=(*emission,1)
        bs.inputs["Emission Strength"].default_value=strength
    return m
floor=material("Wet reflective studio",(.009,.016,.03),.78,.16)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.035))
bpy.context.object.name="Reflective studio floor";bpy.context.object.data.materials.append(floor)
def area(name, location, power, color, size, target=(0,0,1)):
    bpy.ops.object.light_add(type="AREA",location=location)
    o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape="DISK";o.data.size=size
    o.rotation_euler=(Vector(target)-o.location).to_track_quat("-Z","Y").to_euler()
area("Large softbox", (0,-6,9),2400,(.78,.9,1),8)
area("Cyan rim",(-5,3,4),1800,(.01,.82,1),5)
area("Violet rim",(5,3,5),1800,(.43,.14,1),5)
area("Front highlight",(4,-7,3),1100,(1,1,1),5)
def ring(name,r,z,rgba):
    bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=.018,major_segments=128,minor_segments=12,location=(0,0,z))
    o=bpy.context.object;o.name=name
    o.data.materials.append(material(name,rgba[:3],0,.1,rgba[:3],7))
ring("Cyan energy ring",4.5,.02,(0,.8,1,1))
ring("Violet energy ring",5.25,.02,(.4,.13,1,1))
bpy.ops.object.camera_add(location=(9,-12,5))
cam=bpy.context.object
def point_camera(point):cam.rotation_euler=(Vector(point)-cam.location).to_track_quat("-Z","Y").to_euler()
point_camera((0,0,1.45));cam.data.type="PERSP";cam.data.lens=46
bpy.context.scene.camera=cam
cam.data.dof.use_dof=True;cam.data.dof.focus_distance=(cam.location-Vector((0,0,1.5))).length;cam.data.dof.aperture_fstop=8
scene=bpy.context.scene
scene.render.engine="CYCLES";scene.cycles.samples=96
scene.render.resolution_x=3840;scene.render.resolution_y=2160;scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG";scene.render.image_settings.color_mode="RGBA"
scene.render.film_transparent=False
scene.world.color=(.015,.018,.035)
scene.view_settings.view_transform="AgX"
scene.frame_start=1;scene.frame_end=300;scene.render.fps=60
# Cinematic dolly-in and subtle orbit; the model itself stays stable.
for frame,loc in [(1,(10,-14,6)),(80,(9,-12,5)),(170,(8,-11,4.5)),(240,(7.5,-10,4.3)),(300,(7.5,-10,4.3))]:
    cam.location=loc;point_camera((0,0,1.5));cam.keyframe_insert("location",frame=frame);cam.keyframe_insert("rotation_euler",frame=frame)
for curve in cam.animation_data.action.fcurves:
    for point in curve.keyframe_points:point.interpolation="BEZIER"
out=os.path.abspath("renders/transitos")
os.makedirs(out,exist_ok=True)
scene.render.filepath=os.path.join(out,"frame_")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,"transitos_cinematic.blend"))
print("SCENE BUILT:",out,"MODEL:",model_path)
print("RENDER: blender -b",os.path.join(out,"transitos_cinematic.blend"),"-a")
