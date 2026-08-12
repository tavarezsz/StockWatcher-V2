type ContainerProps = {
  children: React.ReactNode;
};

export function Container({children}: ContainerProps){
    return(
        <div className="w-full h-full p-8 bg-background-sec">
            {children}
        </div>
    )
}