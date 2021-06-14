---
id: deploy_ec2_instance
title: Deploy an AWS EC2 instance
description: Set up an Ubuntu machine to run a Status Node
---

## Deploy an AWS EC2 instance

This guide will walk you through how to set up an Ubuntu machine to run a Status Node. Afterwards you can follow this [Step-by-Step guide](../status_node_step_by_step.html) to configure the Status Node.

### 1. Sign in to a cloud provider you prefer

<img src="./deploy_ec2/sign-in.png" alt="sign-in" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 2. Go to EC2

<img src="./deploy_ec2/ec2.png" alt="ec2" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 3. Click "Instances"

<img src="./deploy_ec2/instances.png" alt="instances" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 4. Click "Launch instances"

<img src="./deploy_ec2/launch-instances.png" alt="launch-instances" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 5. Create an Ubuntu instance (recommend 20.04)

<img src="./deploy_ec2/create-ubuntu.png" alt="create-ubuntu" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 6. Choose an instance type

- A single instance with 1GB of RAM and 1 vCPU should be enough to run Status Node reliably.

<img src="./deploy_ec2/choose-instance.png" alt="choose-instance" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 7. Add storage

- Status Node, also known as a history node or mailserver, requires additional disk space. Around 1 GB of free space would be a start for storing last <b>30 days</b>.

<img src="./deploy_ec2/add-storage.png" alt="add-storage" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 8. Open the 30303 port for TCP & UDP

- TCP: Add rule > Custom TCP rule > Port Range : 30303 > Source : Anywhere

- UDP: Add rule  > Custom UDP rule > Port Range : 30303 > Source : Anywhere

<img src="./deploy_ec2/tcp-udp.png" alt="tcp-udp" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 9. Key pair settings

- Key pair: a private key to access your machine.

- Don’t delete or lose the .pem file

<img src="./deploy_ec2/key-pair-settings.png" alt="key-pair-settings" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 10. Check the instance state

- Check if the instance is running

<img src="./deploy_ec2/instance-running.png" alt="instance-running" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

### 11. Connect to the instance 

#### Option 1: EC2 Instance connect

<img src="./deploy_ec2/connect-option-1.png" alt="connect-option-1" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

#### Option 2: SSH

1. Open your termnial

2. Move to the directory where you saved your key pair

3. Change key pair permission
  - Linux or Mac: `chmode 400 {pem-filename}`
  (e.g., chmod 400 status-node.pem)
  - Windows [Guide](https://superuser.com/questions/1296024/windows-ssh-permissions-for-private-key-are-too-open)

4. `ssh -i “{pem-filename}” ubuntu@{Public-DNS}`
(e.g., ssh -i "status-node.pem" ubuntu@ec2-12-345-678-901.ap-northeast-2.compute.amazonaws.com)

<img src="./deploy_ec2/connect-option-2.png" alt="connect-option-2" style="max-width:1000px;width:100%;margin:20px auto;padding:10px 0 10px 0;"/>

<br/>

If you successfully deployed an EC2 instance, please follow this [Status Node Step-by-Step guide](../status_node_step_by_step.html) to configure a Status Node.